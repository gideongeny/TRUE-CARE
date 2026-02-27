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

    private lateinit var navButtons: List<ImageButton>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_patient)

        navButtons = listOf(
            findViewById(R.id.nav_home),
            findViewById(R.id.nav_schedule),
            findViewById(R.id.nav_payments),
            findViewById(R.id.nav_profile)
        )

        navButtons[0].setOnClickListener { switchFragment(HomeFragment(), 0) }
        navButtons[1].setOnClickListener { switchFragment(ScheduleFragment(), 1) }
        navButtons[2].setOnClickListener { switchFragment(PaymentsFragment(), 2) }
        navButtons[3].setOnClickListener { switchFragment(ProfileFragment(), 3) }

        // Start with Home
        if (savedInstanceState == null) {
            switchFragment(HomeFragment(), 0)
        }
    }

    private fun switchFragment(fragment: Fragment, index: Int) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()

        // Update Nav UI
        navButtons.forEachIndexed { i, btn ->
            if (i == index) {
                btn.setAlpha(1.0f)
                btn.setColorFilter(getColor(com.google.android.material.R.color.material_dynamic_neutral90))
            } else {
                btn.setAlpha(0.6f)
                btn.setColorFilter(getColor(R.color.med_text_secondary))
            }
        }
    }
}
