package com.example.caregiver

import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.google.android.material.appbar.MaterialToolbar
import com.example.caregiver.api.ApiClient
import com.example.caregiver.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AnalyticsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_analytics)

        setupToolbar()
        setupCharts()
        loadAnalyticsData()
    }

    private fun setupToolbar() {
        val toolbar = findViewById<MaterialToolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }
    }

    private fun setupCharts() {
        val velocityChart = findViewById<BarChart>(R.id.velocityChart)
        
        // Bar Chart Setup
        val barEntries = ArrayList<BarEntry>()
        barEntries.add(BarEntry(0f, 10f))
        barEntries.add(BarEntry(1f, 15f))
        barEntries.add(BarEntry(2f, 8f))
        barEntries.add(BarEntry(3f, 20f))
        
        val barDataSet = BarDataSet(barEntries, "Deployment Velocity")
        barDataSet.color = getColor(R.color.emerald_primary)
        
        val barData = BarData(barDataSet)
        velocityChart.data = barData
        velocityChart.invalidate()
    }

    private fun loadAnalyticsData() {
        findViewById<TextView>(R.id.tvPatientCount).text = "42"
        findViewById<TextView>(R.id.tvCaregiverCount).text = "18"
    }
}
