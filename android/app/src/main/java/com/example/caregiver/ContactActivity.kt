package com.example.caregiver

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class ContactActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contact)

        findViewById<View>(R.id.cvWhatsApp).setOnClickListener {
            openWhatsApp("+254XXXXXXXXX") // Placeholder for actual support number
        }

        findViewById<View>(R.id.cvCall).setOnClickListener {
            makeCall("+254XXXXXXXXX")
        }
    }

    private fun openWhatsApp(number: String) {
        try {
            val url = "https://api.whatsapp.com/send?phone=$number"
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse(url)
            startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(this, "WhatsApp not installed", Toast.LENGTH_SHORT).show()
        }
    }

    private fun makeCall(number: String) {
        val intent = Intent(Intent.ACTION_DIAL)
        intent.data = Uri.parse("tel:$number")
        startActivity(intent)
    }
}
