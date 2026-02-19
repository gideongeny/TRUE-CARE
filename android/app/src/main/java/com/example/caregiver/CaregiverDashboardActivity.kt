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

class CaregiverDashboardActivity : AppCompatActivity() {

    private lateinit var rvShifts: RecyclerView
    private lateinit var adapter: ShiftAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_caregiver)

        rvShifts = findViewById(R.id.rvShifts)
        rvShifts.layoutManager = LinearLayoutManager(this)
        
        findViewById<View>(R.id.btnSettings).setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }

        adapter = ShiftAdapter()
        rvShifts.adapter = adapter

        fetchShifts()
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
