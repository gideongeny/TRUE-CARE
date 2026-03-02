package com.example.caregiver

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.VerificationDoc
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class VerificationActivity : AppCompatActivity() {

    private lateinit var tvStatus: TextView
    private lateinit var btnUploadLicense: Button
    private lateinit var btnUploadID: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_verification)

        tvStatus = findViewById(R.id.tvVerificationStatus)
        btnUploadLicense = findViewById(R.id.btnUploadLicense)
        btnUploadID = findViewById(R.id.btnUploadID)

        btnUploadLicense.setOnClickListener {
            uploadMockDoc("Nursing License")
        }

        btnUploadID.setOnClickListener {
            uploadMockDoc("ID Card")
        }

        fetchStatus()
    }

    private fun fetchStatus() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getVerificationStatus()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        val status = response.body()!!
                        tvStatus.text = if (status.isVerified) "VERIFIED" else "PENDING REVIEW"
                        tvStatus.setTextColor(if (status.isVerified) android.graphics.Color.GREEN else android.graphics.Color.parseColor("#B45309"))
                    }
                }
            } catch (e: Exception) { e.printStackTrace() }
        }
    }

    private fun uploadMockDoc(title: String) {
        // In a real app, this would use an Intent to pick a file and a real upload service.
        // For v2.0 Demo, we simulate the upload to demonstrate the flow.
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val mockDoc = VerificationDoc(
                    id = "",
                    title = title,
                    docUrl = "https://example.com/mock-doc.pdf",
                    status = "PENDING",
                    createdAt = ""
                )
                val response = ApiClient.apiService.uploadDoc(mockDoc)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@VerificationActivity, "$title Uploaded!", Toast.LENGTH_SHORT).show()
                        fetchStatus()
                    }
                }
            } catch (e: Exception) { e.printStackTrace() }
        }
    }
}
