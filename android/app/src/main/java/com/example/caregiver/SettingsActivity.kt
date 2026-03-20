package com.example.caregiver

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.utils.SessionManager
import com.google.android.material.switchmaterial.SwitchMaterial

class SettingsActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        sessionManager = SessionManager(this)

        val switchBiometric = findViewById<SwitchMaterial>(R.id.switchBiometric)
        switchBiometric.isChecked = sessionManager.isBiometricEnabled()
        switchBiometric.setOnCheckedChangeListener { _, isChecked ->
            sessionManager.setBiometricEnabled(isChecked)
        }

        findViewById<View>(R.id.btnPrivacy).setOnClickListener {
            // Future: startActivity(Intent(this, PrivacyPolicyActivity::class.java))
        }

        findViewById<View>(R.id.btnTerms).setOnClickListener {
            // Future: startActivity(Intent(this, TermsOfServiceActivity::class.java))
        }

        findViewById<View>(R.id.btnSignOut).setOnClickListener {
            sessionManager.clearSession()
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }

    private fun openUrl(url: String) {
        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        startActivity(browserIntent)
    }
}
