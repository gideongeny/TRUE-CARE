package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.api.ApiClient
import com.google.android.material.button.MaterialButton
import com.google.android.material.appbar.MaterialToolbar
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AdminDashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin)

        setupToolbar()
        setupClickListeners()
        setupRecyclerView()
        loadDashboardData()
    }

    private fun setupToolbar() {
        val toolbar = findViewById<MaterialToolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(true)
    }

    private fun setupClickListeners() {
        findViewById<MaterialButton>(R.id.btnAnalytics).setOnClickListener {
            startActivity(Intent(this, AnalyticsActivity::class.java))
        }

        findViewById<MaterialButton>(R.id.btnPersonnelOversight).setOnClickListener {
            // Future: Personnel list activity
        }

        findViewById<MaterialButton>(R.id.btnVerificationQueue).setOnClickListener {
            startActivity(Intent(this, VerificationActivity::class.java))
        }
    }

    private fun setupRecyclerView() {
        findViewById<RecyclerView>(R.id.rvPersonnel).layoutManager = LinearLayoutManager(this)
        // Future: Add adapter for personnel list
    }

    private fun loadDashboardData() {
        val tvTotalRevenue = findViewById<TextView>(R.id.tvTotalRevenue)
        val tvActiveShifts = findViewById<TextView>(R.id.tvActiveShifts)

        // Placeholder data loading
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Fetch stats from API
                withContext(Dispatchers.Main) {
                    tvTotalRevenue.text = "KSh 128,400"
                    tvActiveShifts.text = "14"
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
