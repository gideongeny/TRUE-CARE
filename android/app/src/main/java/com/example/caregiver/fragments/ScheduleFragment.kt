package com.example.caregiver.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.R

class ScheduleFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_schedule, container, false)
        
        val rvSchedule = view.findViewById<RecyclerView>(R.id.rvSchedule)
        rvSchedule.layoutManager = LinearLayoutManager(context)
        
        // Load shifts from API logic here
        
        return view
    }
}
