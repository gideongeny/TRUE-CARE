package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.example.caregiver.fragments.HomeFragment
import com.example.caregiver.fragments.PaymentsFragment
import com.example.caregiver.fragments.ProfileFragment
import com.example.caregiver.fragments.ScheduleFragment

class PatientDashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_patient)

        val navView = findViewById<com.google.android.material.bottomnavigation.BottomNavigationView>(R.id.bottomNavigation)
        
        // Default fragment
        if (savedInstanceState == null) {
            loadFragment(HomeFragment())
        }

        navView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadFragment(HomeFragment())
                    true
                }
                R.id.nav_schedule -> {
                    loadFragment(ScheduleFragment())
                    true
                }
                R.id.nav_payments -> {
                    loadFragment(PaymentsFragment())
                    true
                }
                R.id.nav_profile -> {
                    loadFragment(ProfileFragment())
                    true
                }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
