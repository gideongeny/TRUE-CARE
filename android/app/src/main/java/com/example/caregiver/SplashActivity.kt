package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

import com.example.caregiver.utils.SessionManager
import com.example.caregiver.api.ApiClient

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        val sessionManager = SessionManager(this)

        // Add a deliberate delay for a premium feel
        Handler(Looper.getMainLooper()).postDelayed({
            val token = sessionManager.getToken()
            if (token != null) {
                ApiClient.setToken(token)
                val role = sessionManager.getRole()
                val intent = if (role == "CAREGIVER") {
                    Intent(this, CaregiverDashboardActivity::class.java)
                } else {
                    Intent(this, PatientDashboardActivity::class.java)
                }
                startActivity(intent)
            } else {
                startActivity(Intent(this, RoleSelectionActivity::class.java))
            }
            finish()
        }, 2500)
    }
}
