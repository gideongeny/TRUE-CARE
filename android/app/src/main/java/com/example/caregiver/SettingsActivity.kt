package com.example.caregiver

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.ImageButton
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.utils.SessionManager
import com.google.android.material.button.MaterialButton
import com.google.android.material.switchmaterial.SwitchMaterial

class SettingsActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        sessionManager = SessionManager(this)

        findViewById<ImageButton>(R.id.btnBack).setOnClickListener {
            finish()
        }

        val switchBiometric = findViewById<SwitchMaterial>(R.id.switchBiometric)
        switchBiometric.isChecked = sessionManager.isBiometricEnabled()
        switchBiometric.setOnCheckedChangeListener { _, isChecked ->
            sessionManager.setBiometricEnabled(isChecked)
        }

        findViewById<LinearLayout>(R.id.btnPrivacy).setOnClickListener {
            openUrl("https://true-care-phi.vercel.app/privacy-policy")
        }

        findViewById<LinearLayout>(R.id.btnTerms).setOnClickListener {
            openUrl("https://true-care-phi.vercel.app/privacy-policy") // Demo terms
        }

        findViewById<MaterialButton>(R.id.btnSignOut).setOnClickListener {
            sessionManager.clearSession()
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }

    private fun openUrl(url: String) {
        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        startActivity(browserIntent)
    }
}
