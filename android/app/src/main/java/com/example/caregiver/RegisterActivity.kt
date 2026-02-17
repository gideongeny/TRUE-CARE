package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.RadioButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.RegisterRequest
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RegisterActivity : AppCompatActivity() {
    private lateinit var etName: TextInputEditText
    private lateinit var etEmail: TextInputEditText
    private lateinit var etPhone: TextInputEditText
    private lateinit var etPassword: TextInputEditText
    private lateinit var etConfirmPassword: TextInputEditText
    private lateinit var rbPatient: RadioButton
    private lateinit var rbCaregiver: RadioButton
    private lateinit var btnRegister: MaterialButton
    private lateinit var progressBar: ProgressBar
    private lateinit var tvLoginLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // Initialize views
        etName = findViewById(R.id.etName)
        etEmail = findViewById(R.id.etEmail)
        etPhone = findViewById(R.id.etPhone)
        etPassword = findViewById(R.id.etPassword)
        etConfirmPassword = findViewById(R.id.etConfirmPassword)
        rbPatient = findViewById(R.id.rbPatient)
        rbCaregiver = findViewById(R.id.rbCaregiver)
        btnRegister = findViewById(R.id.btnRegister)
        progressBar = findViewById(R.id.progressBar)
        tvLoginLink = findViewById(R.id.tvLoginLink)

        btnRegister.setOnClickListener {
            register()
        }

        tvLoginLink.setOnClickListener {
            finish() // Go back to login
        }
    }

    private fun register() {
        val name = etName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val phone = etPhone.text.toString().trim()
        val password = etPassword.text.toString()
        val confirmPassword = etConfirmPassword.text.toString()
        val role = if (rbPatient.isChecked) "PATIENT" else "CAREGIVER"

        // Validation
        if (name.isEmpty()) {
            Toast.makeText(this, "Please enter your full name", Toast.LENGTH_SHORT).show()
            return
        }

        if (email.isEmpty()) {
            Toast.makeText(this, "Please enter your email", Toast.LENGTH_SHORT).show()
            return
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(this, "Please enter a valid email", Toast.LENGTH_SHORT).show()
            return
        }

        if (password.isEmpty()) {
            Toast.makeText(this, "Please enter a password", Toast.LENGTH_SHORT).show()
            return
        }

        if (password.length < 6) {
            Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
            return
        }

        if (password != confirmPassword) {
            Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
            return
        }

        // Show loading
        btnRegister.visibility = View.INVISIBLE
        progressBar.visibility = View.VISIBLE

        // Make API call
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Split name into first and last
                val nameParts = name.split(" ", limit = 2)
                val firstName = nameParts.getOrNull(0) ?: name
                val lastName = nameParts.getOrNull(1) ?: ""

                val request = RegisterRequest(
                    firstName = firstName,
                    lastName = lastName,
                    email = email,
                    password = password,
                    role = role,
                    phone = phone.ifEmpty { null }
                )

                val response = ApiClient.apiService.register(request)

                withContext(Dispatchers.Main) {
                    btnRegister.visibility = View.VISIBLE
                    progressBar.visibility = View.GONE

                    if (response.isSuccessful && response.body() != null) {
                        val registerResponse = response.body()!!
                        ApiClient.setToken(registerResponse.token)

                        Toast.makeText(
                            this@RegisterActivity,
                            "Account created successfully!",
                            Toast.LENGTH_SHORT
                        ).show()

                        // Navigate to appropriate dashboard
                        val intent = if (registerResponse.user.role == "CAREGIVER") {
                            Intent(this@RegisterActivity, CaregiverDashboardActivity::class.java)
                        } else {
                            Intent(this@RegisterActivity, PatientDashboardActivity::class.java)
                        }
                        startActivity(intent)
                        finish()
                    } else {
                        val errorBody = response.errorBody()?.string()
                        Toast.makeText(
                            this@RegisterActivity,
                            "Registration failed: ${errorBody ?: "Unknown error"}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    btnRegister.visibility = View.VISIBLE
                    progressBar.visibility = View.GONE
                    Toast.makeText(
                        this@RegisterActivity,
                        "Error: ${e.message}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }
}
