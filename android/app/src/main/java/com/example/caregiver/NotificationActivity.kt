package com.example.caregiver

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.Notification
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class NotificationActivity : AppCompatActivity() {

    private lateinit var rvNotifications: RecyclerView
    private lateinit var adapter: NotificationAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notifications)

        rvNotifications = findViewById(R.id.rvNotifications)
        rvNotifications.layoutManager = LinearLayoutManager(this)
        adapter = NotificationAdapter { notificationId -> markAsRead(notificationId) }
        rvNotifications.adapter = adapter

        fetchNotifications()
    }

    private fun fetchNotifications() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.getNotifications()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        adapter.setNotifications(response.body()!!)
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun markAsRead(id: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                ApiClient.apiService.markNotificationRead(id)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}

class NotificationAdapter(private val onRead: (String) -> Unit) : RecyclerView.Adapter<NotificationAdapter.NotificationViewHolder>() {
    private var notifications: List<Notification> = emptyList()

    fun setNotifications(newNotifications: List<Notification>) {
        notifications = newNotifications
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_notification, parent, false)
        return NotificationViewHolder(view)
    }

    override fun onBindViewHolder(holder: NotificationViewHolder, position: Int) {
        val n = notifications[position]
        holder.tvTitle.text = n.title
        holder.tvMessage.text = n.message
        holder.tvTime.text = n.createdAt
        holder.vIndicator.visibility = if (n.isRead) View.INVISIBLE else View.VISIBLE
        
        holder.itemView.setOnClickListener {
            if (!n.isRead) {
                onRead(n.id)
                holder.vIndicator.visibility = View.INVISIBLE
            }
        }
    }

    override fun getItemCount(): Int = notifications.size

    class NotificationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvTitle: TextView = itemView.findViewById(R.id.tvNotificationTitle)
        val tvMessage: TextView = itemView.findViewById(R.id.tvNotificationMessage)
        val tvTime: TextView = itemView.findViewById(R.id.tvNotificationTime)
        val vIndicator: View = itemView.findViewById(R.id.vStatusIndicator)
    }
}
