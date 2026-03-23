package com.example.caregiver.fragments

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.R
import com.example.caregiver.VerificationActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.Shift
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CaregiverHomeFragment : Fragment() {

    private lateinit var tvShiftTimer: TextView
    private lateinit var btnClockIn: MaterialButton
    private lateinit var btnAssessment: MaterialButton
    private lateinit var tvCurrentPatientName: TextView
    private lateinit var tvCurrentPatientAilment: TextView
    private lateinit var rvShifts: RecyclerView
    private lateinit var cvVerification: View

    private var isClockedIn = false
    private var activeShiftId: String? = null
    private var secondsElapsed = 0
    private var handler = Handler(Looper.getMainLooper())
    private var runnable: Runnable? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_caregiver_home, container, false)

        tvShiftTimer = view.findViewById(R.id.tvShiftTimer)
        btnClockIn = view.findViewById(R.id.btnClockIn)
        btnAssessment = view.findViewById(R.id.btnAssessment)
        tvCurrentPatientName = view.findViewById(R.id.tvCurrentPatientName)
        tvCurrentPatientAilment = view.findViewById(R.id.tvCurrentPatientAilment)
        rvShifts = view.findViewById(R.id.rvShifts)
        cvVerification = view.findViewById(R.id.cvVerificationBanner)

        rvShifts.layoutManager = LinearLayoutManager(context)
        
        btnClockIn.setOnClickListener {
            toggleClockIn()
        }

        btnAssessment.setOnClickListener {
            val intent = Intent(context, com.example.caregiver.AssessmentActivity::class.java)
            intent.putExtra("SHIFT_ID", activeShiftId ?: "demo-shift-id")
            startActivity(intent)
        }

        cvVerification.setOnClickListener {
            startActivity(Intent(context, VerificationActivity::class.java))
        }

        // Initial state for btnAssessment
        btnAssessment.visibility = View.GONE

        fetchShifts()
        return view
    }

    private fun toggleClockIn() {
        isClockedIn = !isClockedIn
        if (isClockedIn) {
            btnClockIn.text = "CLOCK OUT"
            btnClockIn.backgroundTintList = android.content.res.ColorStateList.valueOf(android.graphics.Color.parseColor("#EF4444"))
            btnAssessment.visibility = View.VISIBLE
            startTimer()
            tvCurrentPatientName.text = "John Doe"
            tvCurrentPatientAilment.text = "Post-Op Recovery"
            activeShiftId = "demo-shift-123" // In real app, this comes from API
        } else {
            btnClockIn.text = "CLOCK IN"
            btnClockIn.backgroundTintList = android.content.res.ColorStateList.valueOf(android.graphics.Color.parseColor("#0D9488"))
            btnAssessment.visibility = View.GONE
            stopTimer()
            tvCurrentPatientName.text = "No Active Session"
            tvCurrentPatientAilment.text = "Standby Mode"
            Toast.makeText(context, "Shift completed and logged", Toast.LENGTH_SHORT).show()
        }
    }

    private fun startTimer() {
        runnable = object : Runnable {
            override fun run() {
                secondsElapsed++
                val hours = secondsElapsed / 3600
                val minutes = (secondsElapsed % 3600) / 60
                val secs = secondsElapsed % 60
                tvShiftTimer.text = String.format("%02d:%02d:%02d", hours, minutes, secs)
                handler.postDelayed(this, 1000)
            }
        }
        handler.post(runnable!!)
    }

    private fun stopTimer() {
        runnable?.let { handler.removeCallbacks(it) }
        secondsElapsed = 0
        tvShiftTimer.text = "00:00:00"
    }

    private fun fetchShifts() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getShifts()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        // Adapter logic would go here
                    }
                }
            } catch (e: Exception) { e.printStackTrace() }
        }
    }
}
