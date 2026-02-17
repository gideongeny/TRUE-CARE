package com.example.caregiver

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.ServiceRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PatientDashboardActivity : AppCompatActivity() {

    private lateinit var rvRequests: RecyclerView
    private lateinit var btnNewRequest: Button
    private lateinit var adapter: RequestAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_patient)

        rvRequests = findViewById(R.id.rvRequests)
        btnNewRequest = findViewById(R.id.btnNewRequest)
        
        rvRequests.layoutManager = LinearLayoutManager(this)
        adapter = RequestAdapter()
        rvRequests.adapter = adapter

        btnNewRequest.setOnClickListener {
            showNewRequestDialog()
        }

        fetchRequests()
    }

    private fun fetchRequests() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getRequests()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        adapter.setRequests(response.body()!!)
                    }
                }
            } catch (e: Exception) {
                // Handle error
            }
        }
    }

    private fun showNewRequestDialog() {
        // Build dialog programmatically
        val context = this
        val layout = android.widget.LinearLayout(context)
        layout.orientation = android.widget.LinearLayout.VERTICAL
        layout.setPadding(50, 40, 50, 10)

        val etCareType = EditText(context)
        etCareType.hint = "Care Type (e.g. Nursing)"
        layout.addView(etCareType)

        val etDuration = EditText(context)
        etDuration.hint = "Duration (e.g. 4 hours)"
        layout.addView(etDuration)

        val etLocation = EditText(context)
        etLocation.hint = "Location"
        layout.addView(etLocation)

        AlertDialog.Builder(context)
            .setTitle("New Service Request")
            .setView(layout)
            .setPositiveButton("Submit") { _, _ ->
                val careType = etCareType.text.toString()
                val duration = etDuration.text.toString()
                val location = etLocation.text.toString()
                
                if (careType.isNotEmpty() && duration.isNotEmpty() && location.isNotEmpty()) {
                    createRequest(careType, duration, location)
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun createRequest(careType: String, duration: String, location: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = ServiceRequest("", careType, duration, location, "PENDING", null, "")
                val response = ApiClient.apiService.createRequest(request)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@PatientDashboardActivity, "Request created", Toast.LENGTH_SHORT).show()
                        fetchRequests()
                    } else {
                        Toast.makeText(this@PatientDashboardActivity, "Failed to create request", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                 withContext(Dispatchers.Main) {
                    Toast.makeText(this@PatientDashboardActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                 }
            }
        }
    }
}

class RequestAdapter : RecyclerView.Adapter<RequestAdapter.RequestViewHolder>() {
    private var requests: List<ServiceRequest> = emptyList()

    fun setRequests(newRequests: List<ServiceRequest>) {
        requests = newRequests
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RequestViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(android.R.layout.simple_list_item_2, parent, false)
        return RequestViewHolder(view)
    }

    override fun onBindViewHolder(holder: RequestViewHolder, position: Int) {
        val request = requests[position]
        holder.bind(request)
    }

    override fun getItemCount(): Int = requests.size

    class RequestViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val text1: TextView = itemView.findViewById(android.R.id.text1)
        private val text2: TextView = itemView.findViewById(android.R.id.text2)

        fun bind(request: ServiceRequest) {
            text1.text = "${request.careType} - ${request.duration}"
            text2.text = "Status: ${request.status} | Loc: ${request.location}"
        }
    }
}
