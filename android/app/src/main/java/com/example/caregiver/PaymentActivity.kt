package com.example.caregiver

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.PaymentRequest
import com.example.caregiver.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PaymentActivity : AppCompatActivity() {

    private lateinit var etMpesaPhone: EditText
    private lateinit var btnPay: Button
    private lateinit var pbPayment: ProgressBar
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_payment)

        sessionManager = SessionManager(this)
        etMpesaPhone = findViewById(R.id.etMpesaPhone)
        btnPay = findViewById(R.id.btnPay)
        pbPayment = findViewById(R.id.pbPayment)

        btnPay.setOnClickListener {
            initiatePayment()
        }
    }

    private fun initiatePayment() {
        val phone = etMpesaPhone.text.toString().trim()
        if (phone.isEmpty()) {
            Toast.makeText(this, "Please enter M-Pesa phone number", Toast.LENGTH_SHORT).show()
            return
        }

        btnPay.visibility = View.INVISIBLE
        pbPayment.visibility = View.VISIBLE

        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Mocking userId for now, should come from SessionManager
                val response = ApiClient.apiService.initiateStkPush(
                    PaymentRequest(
                        amount = 2500,
                        phoneNumber = phone,
                        userId = "current_user_id" 
                    )
                )

                withContext(Dispatchers.Main) {
                    btnPay.visibility = View.VISIBLE
                    pbPayment.visibility = View.GONE

                    if (response.isSuccessful) {
                        Toast.makeText(this@PaymentActivity, "STK Push Sent! Check your phone.", Toast.LENGTH_LONG).show()
                        // In reality, poll for status or wait for callback
                    } else {
                        Toast.makeText(this@PaymentActivity, "Payment initiation failed", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    btnPay.visibility = View.VISIBLE
                    pbPayment.visibility = View.GONE
                    Toast.makeText(this@PaymentActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
