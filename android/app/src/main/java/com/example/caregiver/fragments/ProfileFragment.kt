package com.example.caregiver.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.caregiver.LoginActivity
import com.example.caregiver.NotificationActivity
import com.example.caregiver.SettingsActivity
import com.example.caregiver.R
import com.example.caregiver.VerificationActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.utils.SessionManager

class ProfileFragment : Fragment() {

    private lateinit var tvName: TextView
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_profile, container, false)

        sessionManager = SessionManager(requireContext())
        tvName = view.findViewById(R.id.tvProfileName)

        view.findViewById<View>(R.id.btnNotifications).setOnClickListener {
            startActivity(Intent(context, NotificationActivity::class.java))
        }

        view.findViewById<View>(R.id.btnSettings).setOnClickListener {
            startActivity(Intent(context, SettingsActivity::class.java))
        }

        view.findViewById<View>(R.id.btnLogout).setOnClickListener {
            logout()
        }

        fetchProfile()
        return view
    }

    private fun fetchProfile() {
        // Mocking name for demo, real implementation would fetch from /auth/me
        tvName.text = "Gideon Geng"
    }

    private fun logout() {
        sessionManager.clearSession()
        val intent = Intent(context, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }
}
