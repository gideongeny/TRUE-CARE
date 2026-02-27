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
    private lateinit var tvTodayEarnings: TextView
    private lateinit var tvCurrentPatientName: TextView
    private lateinit var tvCurrentPatientAilment: TextView
    private lateinit var btnWithdraw: View
    
    private var currentShiftId: String? = null
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
        tvTodayEarnings = findViewById(R.id.tvTodayEarnings)
        tvCurrentPatientName = findViewById(R.id.tvCurrentPatientName)
        tvCurrentPatientAilment = findViewById(R.id.tvCurrentPatientAilment)
        btnWithdraw = findViewById(R.id.btnWithdraw)

        rvShifts.layoutManager = LinearLayoutManager(this)
        
        findViewById<View>(R.id.btnSettings).setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }

        btnClockInOut.setOnClickListener {
            if (currentShiftId == null) {
                Toast.makeText(this, "Please select an accepted shift first", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            toggleClock()
        }

        adapter = ShiftAdapter(
            onAccept = { shiftId -> acceptShift(shiftId) },
            onSelect = { shift -> 
                if (shift.status == "ACCEPTED" || shift.status == "IN_PROGRESS") {
                    currentShiftId = shift.id
                    Toast.makeText(this, "Active Shift: ${shift.patient?.profile?.firstName}", Toast.LENGTH_SHORT).show()
                }
            }
        )
        rvShifts.adapter = adapter

        fetchShifts()
        fetchProfile()
    }

    private fun fetchProfile() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getMe()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        val profile = response.body()!!.profile
                        tvBalance.text = "KSh ${profile?.balance ?: 0.0}"
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun acceptShift(shiftId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.acceptShift(shiftId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@CaregiverDashboardActivity, "Shift Accepted!", Toast.LENGTH_SHORT).show()
                        fetchShifts()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@CaregiverDashboardActivity, "Error accepting shift", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun toggleClock() {
        val shiftId = currentShiftId ?: return
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                if (!isClockedIn) {
                    val response = ApiClient.apiService.clockIn(shiftId)
                    withContext(Dispatchers.Main) {
                        if (response.isSuccessful) {
                            isClockedIn = true
                            startTimeMillis = System.currentTimeMillis()
                            btnClockInOut.text = "CLOCK OUT"
                            btnClockInOut.setBackgroundColor(Color.RED)
                            handler.post(timerRunnable)
                            Toast.makeText(this@CaregiverDashboardActivity, "Clocked In", Toast.LENGTH_SHORT).show()
                        }
                    }
                } else {
                    val response = ApiClient.apiService.clockOut(shiftId)
                    withContext(Dispatchers.Main) {
                        if (response.isSuccessful) {
                            isClockedIn = false
                            handler.removeCallbacks(timerRunnable)
                            btnClockInOut.text = "CLOCK IN"
                            btnClockInOut.setBackgroundColor(Color.parseColor("#4CAF50"))
                            currentShiftId = null
                            Toast.makeText(this@CaregiverDashboardActivity, "Shift Completed! Notified Admin.", Toast.LENGTH_LONG).show()
                            fetchShifts()
                        }
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@CaregiverDashboardActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun fetchShifts() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getShifts()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        val shifts = response.body()!!
                        adapter.setShifts(shifts)
                        
                        // Detect active/current shift
                        val activeShift = shifts.find { it.status == "IN_PROGRESS" || it.status == "ACCEPTED" }
                        activeShift?.let {
                            tvCurrentPatientName.text = "${it.patient?.firstName} ${it.patient?.lastName}"
                            tvCurrentPatientAilment.text = it.notes ?: "Active Care Session"
                        } ?: run {
                            tvCurrentPatientName.text = "No Active Session"
                            tvCurrentPatientAilment.text = "Standby Mode"
                        }
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}

class ShiftAdapter(
    private val onAccept: (String) -> Unit,
    private val onSelect: (Shift) -> Unit
) : RecyclerView.Adapter<ShiftAdapter.ShiftViewHolder>() {
    private var shifts: List<Shift> = emptyList()

    fun setShifts(newShifts: List<Shift>) {
        shifts = newShifts
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ShiftViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_shift_caregiver, parent, false)
        return ShiftViewHolder(view, onAccept, onSelect)
    }

    override fun onBindViewHolder(holder: ShiftViewHolder, position: Int) {
        holder.bind(shifts[position])
    }

    override fun getItemCount(): Int = shifts.size

    class ShiftViewHolder(
        itemView: View,
        private val onAccept: (String) -> Unit,
        private val onSelect: (Shift) -> Unit
    ) : RecyclerView.ViewHolder(itemView) {
        private val tvPatientName: TextView = itemView.findViewById(R.id.tvPatientName)
        private val tvShiftTime: TextView = itemView.findViewById(R.id.tvShiftTime)
        private val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)
        private val btnAccept: Button = itemView.findViewById(R.id.btnAccept)
        private val tvAmount: TextView = itemView.findViewById(R.id.tvAmount)

        fun bind(shift: Shift) {
            tvPatientName.text = "${shift.patient?.profile?.firstName} ${shift.patient?.profile?.lastName}"
            tvShiftTime.text = "${shift.startTime} - ${shift.shiftType}"
            tvStatus.text = shift.status
            tvAmount.text = "Earnings: KSh ${shift.earnings ?: 0}"

            if (shift.status == "ASSIGNED") {
                btnAccept.visibility = View.VISIBLE
                btnAccept.setOnClickListener { onAccept(shift.id) }
            } else {
                btnAccept.visibility = View.GONE
            }

            itemView.setOnClickListener { onSelect(shift) }
        }
    }
}
