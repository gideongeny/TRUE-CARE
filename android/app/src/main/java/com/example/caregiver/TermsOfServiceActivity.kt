package com.example.caregiver

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class TermsOfServiceActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_terms_of_service)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Terms of Service"
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
