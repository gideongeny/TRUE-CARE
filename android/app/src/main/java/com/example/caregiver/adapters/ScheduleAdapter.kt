package com.example.caregiver.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.R
import com.example.caregiver.models.Shift

class ScheduleAdapter(private var shifts: List<Shift>) :
    RecyclerView.Adapter<ScheduleAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvPatientName: TextView = view.findViewById(R.id.tvPatientName)
        val tvStatus: TextView = view.findViewById(R.id.tvStatus)
        val tvShiftTime: TextView = view.findViewById(R.id.tvShiftTime)
        val tvAmount: TextView = view.findViewById(R.id.tvAmount)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_shift_caregiver, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val shift = shifts[position]
        holder.tvPatientName.text = shift.patient?.firstName ?: "Open Shift"
        holder.tvStatus.text = shift.status
        holder.tvShiftTime.text = "${shift.startTime} - ${shift.endTime}"
        holder.tvAmount.text = "Earnings: KSh ${shift.earnings ?: 0.0}"
        
        // Color status based on value
        when (shift.status) {
            "COMPLETED" -> holder.tvStatus.setBackgroundResource(R.drawable.bg_status_completed)
            "PENDING" -> holder.tvStatus.setBackgroundResource(R.drawable.bg_status_pending)
            else -> holder.tvStatus.setBackgroundResource(R.drawable.bg_status_pending)
        }
    }

    override fun getItemCount() = shifts.size

    fun updateShifts(newShifts: List<Shift>) {
        this.shifts = newShifts
        notifyDataSetChanged()
    }
}
