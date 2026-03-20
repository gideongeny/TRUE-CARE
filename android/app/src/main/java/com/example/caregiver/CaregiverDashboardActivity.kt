package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.example.caregiver.fragments.CaregiverHomeFragment
import com.example.caregiver.fragments.ProfileFragment
import com.example.caregiver.fragments.WalletFragment
import com.google.android.material.bottomnavigation.BottomNavigationView

class CaregiverDashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_caregiver)

        val navView: BottomNavigationView = findViewById(R.id.bottomNavigation)
        
        // Default fragment
        if (savedInstanceState == null) {
            loadFragment(CaregiverHomeFragment())
        }

        navView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadFragment(CaregiverHomeFragment())
                    true
                }
                R.id.nav_schedule -> {
                    loadFragment(com.example.caregiver.fragments.ScheduleFragment())
                    true
                }
                R.id.nav_wallet -> {
                    loadFragment(WalletFragment())
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
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.fragmentContainer, fragment)
        transaction.commit()
    }
}
