package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.LoginRequest
import com.example.caregiver.utils.BiometricHelper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import android.net.Uri

class LoginActivity : AppCompatActivity() {

    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var btnBiometric: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var biometricHelper: BiometricHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)
        btnBiometric = findViewById(R.id.btnBiometric)
        progressBar = findViewById(R.id.progressBar)
        
        biometricHelper = BiometricHelper(this)

        if (biometricHelper.isBiometricAvailable()) {
            btnBiometric.visibility = View.VISIBLE
            btnBiometric.setOnClickListener {
                biometricHelper.showBiometricPrompt(
                    onSuccess = {
                        // In a real app, you'd store encrypted credentials
                        // and use them here. For demo, we'll use stored email/pass if any
                        // or just show a message that it's authenticated.
                        Toast.makeText(this, "Biometric Authentication Successful", Toast.LENGTH_SHORT).show()
                        // Proceed to dashboard if we had saved credentials
                    },
                    onError = { code, message ->
                        Toast.makeText(this, "Authentication error: $message", Toast.LENGTH_SHORT).show()
                    }
                )
            }
        }

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString()
            val password = etPassword.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                login(email, password)
            } else {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            }
        }

        // Privacy Policy
        findViewById<TextView>(R.id.tvPrivacyPolicy).setOnClickListener {
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://true-care-phi.vercel.app/privacy-policy"))
            startActivity(browserIntent)
        }

        // Sign up link
        val tvSignUpLink = findViewById<TextView>(R.id.tvSignUpLink)
        tvSignUpLink.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun login(email: String, password: String) {
        progressBar.visibility = View.VISIBLE
        btnLogin.isEnabled = false

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.login(LoginRequest(email, password))
                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnLogin.isEnabled = true

                    if (response.isSuccessful && response.body() != null) {
                        val loginResponse = response.body()!!
                        ApiClient.setToken(loginResponse.token)
                        
                        // Save user info to SharedPreferences if needed

                        val intent = if (loginResponse.user.role == "CAREGIVER") {
                           Intent(this@LoginActivity, CaregiverDashboardActivity::class.java)
                        } else {
                           Intent(this@LoginActivity, PatientDashboardActivity::class.java)
                        }
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@LoginActivity, "Login failed", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnLogin.isEnabled = true
                    Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
