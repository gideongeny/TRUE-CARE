package com.example.caregiver.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.caregiver.LoginActivity
import com.example.caregiver.R
import com.example.caregiver.utils.SessionManager
import kotlinx.coroutines.launch

class ProfileFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_profile, container, false)
        
        val sessionManager = SessionManager(requireContext())
        val tvName = view.findViewById<TextView>(R.id.tvProfileName)
        val tvEmail = view.findViewById<TextView>(R.id.tvProfileEmail)
        
        view.findViewById<View>(R.id.btnLogout).setOnClickListener {
            sessionManager.clearSession()
            val intent = Intent(context, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }

        fetchUserProfile(tvName, tvEmail)
        
        return view
    }

    private fun fetchUserProfile(tvName: TextView, tvEmail: TextView) {
        val apiService = com.example.caregiver.api.ApiClient.apiService
        lifecycleScope.launch {
            try {
                val response = apiService.getMe()
                if (response.isSuccessful) {
                    val user = response.body()
                    user?.let {
                        tvName.text = "${it.firstName} ${it.lastName}"
                        tvEmail.text = it.email
                    }
                } else {
                    Toast.makeText(context, "Failed to sync profile", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Network Flux Interrupted", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
