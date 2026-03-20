package com.example.caregiver.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import android.widget.Button
import android.widget.EditText
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.R
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.*
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
class PaymentsFragment : Fragment() {

    private lateinit var tvTotalPaid: TextView
    private lateinit var rvPaymentHistory: RecyclerView
    private lateinit var adapter: PaymentAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_payments, container, false)
        
        tvTotalPaid = view.findViewById(R.id.tvTotalPaid)
        rvPaymentHistory = view.findViewById(R.id.rvPaymentHistory)
        rvPaymentHistory.layoutManager = LinearLayoutManager(context)
        adapter = PaymentAdapter()
        rvPaymentHistory.adapter = adapter
        
        view.findViewById<View>(R.id.btnPayNow).setOnClickListener {
            val amountStr = view.findViewById<TextView>(R.id.tvOutstandingBalance).text.toString().replace("KSh ", "").replace(",", "")
            val amount = amountStr.toDoubleOrNull() ?: 0.0
            if (amount > 0) {
                initiatePayment(amount)
            } else {
                Toast.makeText(context, "No balance due", Toast.LENGTH_SHORT).show()
            }
        }

        loadPaymentData()
        
        return view
    }

    private fun initiatePayment(amount: Double) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val meResponse = ApiClient.apiService.getMe()
                val user = meResponse.body()
                val phone = user?.profile?.phone ?: ""
                
                if (phone.isEmpty()) {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(context, "Please update your phone number in Profile", Toast.LENGTH_LONG).show()
                    }
                    return@launch
                }

                val payRequest = PaymentRequest(
                    amount = amount,
                    phoneNumber = phone,
                    userId = user?.id ?: ""
                )
                
                val response = ApiClient.apiService.initiateStkPush(payRequest)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(context, "M-Pesa Prompt Sent! Check your phone.", Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(context, "Payment failed to initiate", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(context, "Service error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun loadPaymentData() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getMe()
                if (response.isSuccessful && response.body() != null) {
                    val user = response.body()!!
                    withContext(Dispatchers.Main) {
                        tvTotalPaid.text = "KSh ${user.profile?.balance ?: 0.00}"
                        user.payments?.let {
                            adapter.setPayments(it)
                        }
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}

class PaymentAdapter : RecyclerView.Adapter<PaymentAdapter.PaymentViewHolder>() {
    private var payments: List<Payment> = emptyList()

    fun setPayments(newPayments: List<Payment>) {
        payments = newPayments
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PaymentViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_payment, parent, false)
        return PaymentViewHolder(view)
    }

    override fun onBindViewHolder(holder: PaymentViewHolder, position: Int) {
        holder.bind(payments[position])
    }

    override fun getItemCount(): Int = payments.size

    class PaymentViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvType: TextView = itemView.findViewById(R.id.tvPaymentType)
        private val tvAmount: TextView = itemView.findViewById(R.id.tvAmount)
        private val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)
        private val tvDate: TextView = itemView.findViewById(R.id.tvDate)

        fun bind(payment: Payment) {
            tvType.text = payment.type
            tvAmount.text = "KSh ${payment.amount}"
            tvStatus.text = payment.status
            tvDate.text = payment.createdAt.toString()
        }
    }
}
