package com.example.caregiver

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.Shift
import android.content.Intent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import android.widget.Button
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import android.graphics.Color

class CaregiverDashboardActivity : AppCompatActivity() {

    private lateinit var rvShifts: RecyclerView
    private lateinit var adapter: ShiftAdapter
    private lateinit var tvShiftTimer: TextView
    private lateinit var btnClockInOut: Button
    private lateinit var tvBalance: TextView
    private lateinit var btnWithdraw: View
    
    private var isClockedIn = false
    private var startTimeMillis: Long = 0
    private val handler = android.os.Handler(android.os.Looper.getMainLooper())
    private val timerRunnable = object : Runnable {
        override fun run() {
            val millis = System.currentTimeMillis() - startTimeMillis
            val seconds = (millis / 1000).toInt()
            val minutes = seconds / 60
            val hours = minutes / 60
            tvShiftTimer.text = String.format("%02d:%02d:%02d", hours, minutes % 60, seconds % 60)
            handler.postDelayed(this, 1000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_caregiver)

        rvShifts = findViewById(R.id.rvShifts)
        tvShiftTimer = findViewById(R.id.tvShiftTimer)
        btnClockInOut = findViewById(R.id.btnClockInOut)
        tvBalance = findViewById(R.id.tvBalance)
        btnWithdraw = findViewById(R.id.btnWithdraw)

        rvShifts.layoutManager = LinearLayoutManager(this)
        
        findViewById<View>(R.id.btnSettings).setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }

        btnClockInOut.setOnClickListener {
            toggleClock()
        }

        btnWithdraw.setOnClickListener {
            Toast.makeText(this, "Withdrawal request submitted! 🚀", Toast.LENGTH_SHORT).show()
        }

        adapter = ShiftAdapter()
        rvShifts.adapter = adapter

        fetchShifts()
    }

    private fun toggleClock() {
        if (!isClockedIn) {
            // Clock In
            isClockedIn = true
            startTimeMillis = System.currentTimeMillis()
            btnClockInOut.text = "CLOCK OUT"
            btnClockInOut.setBackgroundColor(android.graphics.Color.RED)
            btnClockInOut.setTextColor(android.graphics.Color.WHITE)
            handler.post(timerRunnable)
            Toast.makeText(this, "Shift Started", Toast.LENGTH_SHORT).show()
        } else {
            // Clock Out
            isClockedIn = false
            handler.removeCallbacks(timerRunnable)
            btnClockInOut.text = "CLOCK IN"
            btnClockInOut.setBackgroundColor(android.graphics.Color.WHITE)
            btnClockInOut.setTextColor(android.graphics.Color.BLACK)
            Toast.makeText(this, "Shift Ended. Great work!", Toast.LENGTH_LONG).show()
            // Here you would call an API to save the shift
        }
    }

    private fun fetchShifts() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getShifts()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        adapter.setShifts(response.body()!!)
                    }
                }
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}

class ShiftAdapter : RecyclerView.Adapter<ShiftAdapter.ShiftViewHolder>() {
    private var shifts: List<Shift> = emptyList()

    fun setShifts(newShifts: List<Shift>) {
        shifts = newShifts
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ShiftViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(android.R.layout.simple_list_item_2, parent, false)
        return ShiftViewHolder(view)
    }

    override fun onBindViewHolder(holder: ShiftViewHolder, position: Int) {
        val shift = shifts[position]
        holder.bind(shift)
    }

    override fun getItemCount(): Int = shifts.size

    class ShiftViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val text1: TextView = itemView.findViewById(android.R.id.text1)
        private val text2: TextView = itemView.findViewById(android.R.id.text2)

        fun bind(shift: Shift) {
            text1.text = "Patient: ${shift.patient?.profile?.firstName} ${shift.patient?.profile?.lastName}"
            text2.text = "Time: ${shift.startTime} - Status: ${shift.status}"
        }
    }
}
