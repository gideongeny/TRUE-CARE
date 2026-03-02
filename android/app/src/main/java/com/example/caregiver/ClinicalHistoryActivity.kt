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
import com.example.caregiver.models.ClinicalLog
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ClinicalHistoryActivity : AppCompatActivity() {

    private lateinit var rvClinicalLogs: RecyclerView
    private lateinit var adapter: ClinicalLogAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_clinical_history)

        val patientId = intent.getStringExtra("patientId")
        val shiftId = intent.getStringExtra("shiftId")

        rvClinicalLogs = findViewById(R.id.rvClinicalLogs)
        rvClinicalLogs.layoutManager = LinearLayoutManager(this)
        adapter = ClinicalLogAdapter()
        rvClinicalLogs.adapter = adapter

        if (patientId != null) {
            fetchPatientHistory(patientId)
        } else if (shiftId != null) {
            fetchShiftLogs(shiftId)
        }
    }

    private fun fetchPatientHistory(patientId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getPatientHealthHistory(patientId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        adapter.setLogs(response.body()!!)
                    }
                }
            } catch (e: Exception) { e.printStackTrace() }
        }
    }

    private fun fetchShiftLogs(shiftId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getClinicalLogs(shiftId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        adapter.setLogs(response.body()!!)
                    }
                }
            } catch (e: Exception) { e.printStackTrace() }
        }
    }
}

class ClinicalLogAdapter : RecyclerView.Adapter<ClinicalLogAdapter.ClinicalLogViewHolder>() {
    private var logs: List<ClinicalLog> = emptyList()

    fun setLogs(newLogs: List<ClinicalLog>) {
        logs = newLogs
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ClinicalLogViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_clinical_log, parent, false)
        return ClinicalLogViewHolder(view)
    }

    override fun onBindViewHolder(holder: ClinicalLogViewHolder, position: Int) {
        val log = logs[position]
        holder.tvTime.text = log.loggedAt
        holder.tvContent.text = log.content
        holder.tvVitals.text = "Vitals: ${log.vitals ?: "Not Recorded"}"
    }

    override fun getItemCount(): Int = logs.size

    class ClinicalLogViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvTime: TextView = itemView.findViewById(R.id.tvLogTime)
        val tvContent: TextView = itemView.findViewById(R.id.tvLogContent)
        val tvVitals: TextView = itemView.findViewById(R.id.tvVitals)
    }
}
