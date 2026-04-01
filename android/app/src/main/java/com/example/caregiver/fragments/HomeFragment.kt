package com.example.caregiver.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.R
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.ServiceRequest
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
class HomeFragment : Fragment() {

    private lateinit var tvWelcome: TextView
    private lateinit var tvActiveCaregiver: TextView
    private lateinit var rvRequests: RecyclerView
    private lateinit var adapter: RequestAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)
        
        tvWelcome = view.findViewById(R.id.tvWelcome)
        tvActiveCaregiver = view.findViewById(R.id.tvActiveCaregiver)
        rvRequests = view.findViewById(R.id.rvRequests)
        
        rvRequests.layoutManager = LinearLayoutManager(context)
        adapter = RequestAdapter()
        rvRequests.adapter = adapter
        
        view.findViewById<View>(R.id.btnNewRequest).setOnClickListener {
            showNewRequestDialog()
        }

        view.findViewById<View>(R.id.btnHealthHistory).setOnClickListener {
            val intent = android.content.Intent(context, com.example.caregiver.ClinicalHistoryActivity::class.java)
            // Passing current user ID as patientId for health history
            startActivity(intent)
        }

        loadDashboardData()
        fetchRequests()

        val session = com.example.caregiver.utils.SessionManager(requireContext())
        val cvPremiumPromo = view.findViewById<View>(R.id.cvPremiumPromo)
        val btnPayments = view.findViewById<View>(R.id.btnPayments)

        if (!session.isPremium()) {
            cvPremiumPromo.visibility = View.VISIBLE
            btnPayments.visibility = View.GONE
        } else {
            cvPremiumPromo.visibility = View.GONE
            btnPayments.visibility = View.VISIBLE
        }
        
        return view
    }

    private fun showNewRequestDialog() {
        val dialogView = LayoutInflater.from(requireContext()).inflate(R.layout.dialog_new_request, null)
        val etCareType = dialogView.findViewById<TextInputEditText>(R.id.etCareType)
        val etDuration = dialogView.findViewById<TextInputEditText>(R.id.etDuration)
        val etLocation = dialogView.findViewById<TextInputEditText>(R.id.etLocation)
        val etCondition = dialogView.findViewById<TextInputEditText>(R.id.etCondition)
        val btnSubmit = dialogView.findViewById<View>(R.id.btnSubmitRequest)

        val dialog = MaterialAlertDialogBuilder(requireContext())
            .setView(dialogView)
            .create()

        btnSubmit.setOnClickListener {
            val careType = etCareType.text.toString().trim()
            val duration = etDuration.text.toString().trim()
            val location = etLocation.text.toString().trim()
            val ailment = etCondition.text.toString().trim()

            if (careType.isEmpty() || duration.isEmpty() || location.isEmpty()) {
                Toast.makeText(context, "Please fill all required fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val request = ServiceRequest(
                careType = careType,
                duration = duration,
                location = location,
                patientAilment = ailment.ifEmpty { null }
            )

            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val response = ApiClient.apiService.createRequest(request)
                    withContext(Dispatchers.Main) {
                        if (response.isSuccessful) {
                            Toast.makeText(context, "Request Submitted! Admin will price it soon.", Toast.LENGTH_LONG).show()
                            dialog.dismiss()
                            fetchRequests()
                        }
                    }
                } catch (e: Exception) {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        dialog.show()
    }

    private fun loadDashboardData() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getMe()
                if (response.isSuccessful && response.body() != null) {
                    val user = response.body()!!
                    withContext(Dispatchers.Main) {
                        tvWelcome.text = "Hello, ${user.firstName}"
                    }
                }
            } catch (e: Exception) {
                // Silently handle
            }
        }
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
                // error handling
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
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_request, parent, false)
        return RequestViewHolder(view)
    }

    override fun onBindViewHolder(holder: RequestViewHolder, position: Int) {
        val request = requests[position]
        holder.bind(request)
    }

    override fun getItemCount(): Int = requests.size

    class RequestViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvCareType: TextView = itemView.findViewById(R.id.tvCareType)
        private val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)
        private val tvLocation: TextView = itemView.findViewById(R.id.tvLocation)
        private val tvDuration: TextView = itemView.findViewById(R.id.tvDuration)
        private val tvPrice: TextView? = itemView.findViewById(R.id.tvPrice) // Add to item_request.xml

        fun bind(request: ServiceRequest) {
            tvCareType.text = request.careType
            tvStatus.text = request.status.uppercase()
            tvLocation.text = request.location
            tvDuration.text = request.duration
            
            tvPrice?.run {
                if (request.price != null && request.price > 0) {
                    visibility = View.VISIBLE
                    text = "Price: KSh ${request.price}"
                } else {
                    visibility = View.GONE
                }
            }

            when(request.status.uppercase()) {
                "PENDING" -> tvStatus.setTextColor(android.graphics.Color.parseColor("#B45309"))
                "PRICED" -> tvStatus.setTextColor(android.graphics.Color.parseColor("#1D4ED8"))
                "APPROVED" -> tvStatus.setTextColor(android.graphics.Color.parseColor("#059669"))
                else -> tvStatus.setTextColor(android.graphics.Color.parseColor("#6B7280"))
            }
        }
    }
}
