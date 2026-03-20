package com.example.caregiver.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.caregiver.R
import com.example.caregiver.api.ApiClient
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class WalletFragment : Fragment() {

    private lateinit var tvBalance: TextView
    private lateinit var btnWithdraw: MaterialButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_wallet, container, false)

        tvBalance = view.findViewById(R.id.tvWalletBalance)
        btnWithdraw = view.findViewById(R.id.btnWithdrawWallet)

        btnWithdraw.setOnClickListener {
            Toast.makeText(context, "Withdrawal request initiated via M-Pesa", Toast.LENGTH_SHORT).show()
        }

        fetchWallet()
        return view
    }

    private fun fetchWallet() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getWalletBalance()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        tvBalance.text = "KSh ${response.body()!!.balance}"
                    } else {
                        tvBalance.text = "KSh 0.00"
                    }
                }
            } catch (e: Exception) { e.printStackTrace() }
        }
    }
}
