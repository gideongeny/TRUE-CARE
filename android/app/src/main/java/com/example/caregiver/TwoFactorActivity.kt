package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.LoginRequest
import com.example.caregiver.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class TwoFactorActivity : AppCompatActivity() {

    private lateinit var etCode: EditText
    private lateinit var btnVerify: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var sessionManager: SessionManager
    private var userId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_two_factor)

        sessionManager = SessionManager(this)
        userId = intent.getStringExtra("userId")

        etCode = findViewById(R.id.etTwoFactorCode)
        btnVerify = findViewById(R.id.btnVerify2FA)
        progressBar = findViewById(R.id.progressBar)

        btnVerify.setOnClickListener {
            val code = etCode.text.toString().trim()
            if (code.length == 6) {
                verify(code)
            } else {
                Toast.makeText(this, "Please enter a valid 6-digit code", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun verify(code: String) {
        val id = userId ?: return
        progressBar.visibility = View.VISIBLE
        btnVerify.isEnabled = false

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.login(
                    LoginRequest(
                        userId = id,
                        token = code,
                        is2FAAction = true
                    )
                )

                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnVerify.isEnabled = true

                    if (response.isSuccessful && response.body() != null) {
                        val loginResponse = response.body()!!
                        val token = loginResponse.token
                        val user = loginResponse.user

                        if (token != null && user != null) {
                            ApiClient.setToken(token)
                            sessionManager.saveToken(token)
                            sessionManager.saveRole(user.role)

                            val intent = if (user.role == "CAREGIVER") {
                                Intent(this@TwoFactorActivity, CaregiverDashboardActivity::class.java)
                            } else {
                                Intent(this@TwoFactorActivity, PatientDashboardActivity::class.java)
                            }
                            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                            startActivity(intent)
                            finish()
                        }
                    } else {
                        Toast.makeText(this@TwoFactorActivity, "Verification failed. Check your code.", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnVerify.isEnabled = true
                    Toast.makeText(this@TwoFactorActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
