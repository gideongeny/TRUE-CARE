package com.example.caregiver.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.R
import com.example.caregiver.adapters.ScheduleAdapter
import com.example.caregiver.api.ApiClient
import kotlinx.coroutines.launch

class ScheduleFragment : Fragment() {

    private lateinit var adapter: ScheduleAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_schedule, container, false)
        
        val rvSchedule = view.findViewById<RecyclerView>(R.id.rvSchedule)
        rvSchedule.layoutManager = LinearLayoutManager(context)
        adapter = ScheduleAdapter(emptyList())
        rvSchedule.adapter = adapter
        
        fetchShifts()
        
        return view
    }

    private fun fetchShifts() {
        val apiService = ApiClient.apiService
        lifecycleScope.launch {
            try {
                val response = apiService.getShifts()
                if (response.isSuccessful) {
                    val shifts = response.body() ?: emptyList()
                    adapter.updateShifts(shifts)
                } else {
                    Toast.makeText(context, "Failed to sync deployment log", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Log.e("ScheduleFragment", "Network error", e)
                Toast.makeText(context, "Cloud sync interrupted", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
