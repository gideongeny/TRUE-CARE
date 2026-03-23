package com.example.caregiver

import android.os.Bundle
import android.view.View
import android.widget.CheckBox
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.ClinicalLogRequest
import com.example.caregiver.utils.SessionManager
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AssessmentActivity : AppCompatActivity() {

    private lateinit var etPulse: EditText
    private lateinit var etTemp: EditText
    private lateinit var etResp: EditText
    private lateinit var etBP: EditText
    private lateinit var etNutrition: EditText
    private lateinit var etElimination: EditText
    private lateinit var etNotes: EditText
    private lateinit var btnSubmit: MaterialButton

    private lateinit var cbBathing: CheckBox
    private lateinit var cbDressing: CheckBox
    private lateinit var cbMealPrep: CheckBox
    private lateinit var cbLaundry: CheckBox
    private lateinit var cbMedication: CheckBox
    private lateinit var cbHousekeeping: CheckBox

    private lateinit var cbSafetyCall: CheckBox
    private lateinit var cbSafetyBed: CheckBox
    private lateinit var cbSafetyFloor: CheckBox
    private lateinit var cbSafetyLighting: CheckBox

    private var shiftId: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_assessment)

        shiftId = intent.getStringExtra("SHIFT_ID") ?: ""

        // Initialize Views
        etPulse = findViewById(R.id.etPulse)
        etTemp = findViewById(R.id.etTemp)
        etResp = findViewById(R.id.etResp)
        etBP = findViewById(R.id.etBP)
        etNutrition = findViewById(R.id.etNutrition)
        etElimination = findViewById(R.id.etElimination)
        etNotes = findViewById(R.id.etNotes)
        btnSubmit = findViewById(R.id.btnSubmitAssessment)

        cbBathing = findViewById(R.id.cbBathing)
        cbDressing = findViewById(R.id.cbDressing)
        cbMealPrep = findViewById(R.id.cbMealPrep)
        cbLaundry = findViewById(R.id.cbLaundry)
        cbMedication = findViewById(R.id.cbMedication)
        cbHousekeeping = findViewById(R.id.cbHousekeeping)

        cbSafetyCall = findViewById(R.id.cbSafetyCall)
        cbSafetyBed = findViewById(R.id.cbSafetyBed)
        cbSafetyFloor = findViewById(R.id.cbSafetyFloor)
        cbSafetyLighting = findViewById(R.id.cbSafetyLighting)

        btnSubmit.setOnClickListener { submitAssessment() }
    }

    private fun submitAssessment() {
        if (shiftId.isEmpty()) {
            Toast.makeText(this, "Error: No active shift found", Toast.LENGTH_SHORT).show()
            return
        }

        val services = mutableListOf<String>()
        if (cbBathing.isChecked) services.add("Bathing")
        if (cbDressing.isChecked) services.add("Dressing")
        if (cbMealPrep.isChecked) services.add("Meal Prep")
        if (cbLaundry.isChecked) services.add("Laundry")
        if (cbMedication.isChecked) services.add("Medication Rem.")
        if (cbHousekeeping.isChecked) services.add("Housekeeping")

        val safety = mutableListOf<String>()
        if (cbSafetyCall.isChecked) safety.add("Call Light")
        if (cbSafetyBed.isChecked) safety.add("Bed Rails")
        if (cbSafetyFloor.isChecked) safety.add("Floor Clear")
        if (cbSafetyLighting.isChecked) safety.add("Adequate Light")

        val request = ClinicalLogRequest(
            shiftId = shiftId,
            content = etNotes.text.toString().ifEmpty { "Daily assessment update" },
            servicesRendered = services.joinToString(", "),
            pulse = etPulse.text.toString(),
            temperature = etTemp.text.toString(),
            respiration = etResp.text.toString(),
            bloodPressure = etBP.text.toString(),
            nutritionHydration = etNutrition.text.toString(),
            eliminationDetails = etElimination.text.toString(),
            safetyEnvironment = safety.joinToString(", ")
        )

        btnSubmit.isEnabled = false
        btnSubmit.text = "SUBMITTING..."

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.apiService.addClinicalLog(request)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@AssessmentActivity, "Assessment logged successfully", Toast.LENGTH_LONG).show()
                        finish()
                    } else {
                        btnSubmit.isEnabled = true
                        btnSubmit.text = "SUBMIT ASSESSMENT"
                        Toast.makeText(this@AssessmentActivity, "Failed to log assessment", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    btnSubmit.isEnabled = true
                    btnSubmit.text = "SUBMIT ASSESSMENT"
                    Toast.makeText(this@AssessmentActivity, "Connection error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
