package com.example.caregiver

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.RadioButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.caregiver.api.ApiClient
import com.example.caregiver.models.RegisterRequest
import com.example.caregiver.utils.SessionManager
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RegisterActivity : AppCompatActivity() {
    private lateinit var etFirstName: EditText
    private lateinit var etLastName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPhone: EditText
    private lateinit var etPassword: EditText
    private lateinit var etIdNumberCommon: EditText
    private lateinit var etDob: EditText
    private lateinit var etLocation: EditText
    private lateinit var rbPatient: RadioButton
    private lateinit var rbCaregiver: RadioButton
    private lateinit var btnRegister: MaterialButton
    private lateinit var progressBar: ProgressBar
    private lateinit var tvLoginLink: TextView

    private lateinit var llPatientFields: View
    private lateinit var cgDepartments: com.google.android.material.chip.ChipGroup
    private lateinit var etInsuranceNumber: EditText
    private lateinit var etHeight: EditText
    private lateinit var etWeight: EditText
    private lateinit var etCondition: EditText
    private lateinit var etServiceTime: EditText

    private lateinit var llCaregiverFields: View
    private lateinit var etSalary: EditText
    private lateinit var cgAvailability: com.google.android.material.chip.ChipGroup
    private lateinit var etCertifications: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // Initialize views
        etFirstName = findViewById(R.id.etFirstName)
        etLastName = findViewById(R.id.etLastName)
        etEmail = findViewById(R.id.etEmail)
        etPhone = findViewById(R.id.etPhone)
        etPassword = findViewById(R.id.etPassword)
        etIdNumberCommon = findViewById(R.id.etIdNumberCommon)
        etDob = findViewById(R.id.etDob)
        etLocation = findViewById(R.id.etLocation)
        rbPatient = findViewById(R.id.rbPatient)
        rbCaregiver = findViewById(R.id.rbCaregiver)
        btnRegister = findViewById(R.id.btnRegister)
        progressBar = findViewById(R.id.progressBar)
        tvLoginLink = findViewById(R.id.tvLoginLink)

        llPatientFields = findViewById(R.id.llPatientFields)
        cgDepartments = findViewById(R.id.cgDepartments)
        etInsuranceNumber = findViewById(R.id.etInsuranceNumber)
        etHeight = findViewById(R.id.etHeight)
        etWeight = findViewById(R.id.etWeight)
        etCondition = findViewById(R.id.etCondition)
        etServiceTime = findViewById(R.id.etServiceTime)

        llCaregiverFields = findViewById(R.id.llCaregiverFields)
        etSalary = findViewById(R.id.etSalary)
        cgAvailability = findViewById(R.id.cgAvailability)
        etCertifications = findViewById(R.id.etCertifications)

        // Date Picker for DOB
        etDob.setOnClickListener {
            val calendar = java.util.Calendar.getInstance()
            val year = calendar.get(java.util.Calendar.YEAR) - 20
            val month = calendar.get(java.util.Calendar.MONTH)
            val day = calendar.get(java.util.Calendar.DAY_OF_MONTH)

            android.app.DatePickerDialog(this, { _, y, m, d ->
                etDob.setText(String.format("%02d-%02d-%d", d, m + 1, y))
            }, year, month, day).show()
        }

        // Handle Role Toggling
        findViewById<android.widget.RadioGroup>(R.id.rgRole).setOnCheckedChangeListener { _, checkedId ->
            if (checkedId == R.id.rbPatient) {
                llPatientFields.visibility = View.VISIBLE
                llCaregiverFields.visibility = View.GONE
            } else if (checkedId == R.id.rbCaregiver) {
                llPatientFields.visibility = View.GONE
                llCaregiverFields.visibility = View.VISIBLE
            }
        }

        btnRegister.setOnClickListener { register() }
        tvLoginLink.setOnClickListener { finish() }

        // Handle role pre-selection from intent
        intent.getStringExtra("ROLE")?.let { role ->
            if (role == "PATIENT") {
                rbPatient.isChecked = true
            } else if (role == "CAREGIVER") {
                rbCaregiver.isChecked = true
            }
        }
    }

    private fun register() {
        val fName = etFirstName.text.toString().trim()
        val lName = etLastName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val phone = etPhone.text.toString().trim()
        val password = etPassword.text.toString()
        val role = if (rbPatient.isChecked) "PATIENT" else "CAREGIVER"

        if (fName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill required fields", Toast.LENGTH_SHORT).show()
            return
        }

        btnRegister.visibility = View.INVISIBLE
        progressBar.visibility = View.VISIBLE

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val profileData = mutableMapOf<String, Any>()
                profileData["idNumber"] = etIdNumberCommon.text.toString()
                profileData["location"] = etLocation.text.toString()
                profileData["dob"] = etDob.text.toString()

                if (role == "PATIENT") {
                    val selectedDepts = mutableListOf<String>()
                    for (i in 0 until cgDepartments.childCount) {
                        val chip = cgDepartments.getChildAt(i) as com.google.android.material.chip.Chip
                        if (chip.isChecked) selectedDepts.add(chip.text.toString())
                    }
                    profileData["targetDepartments"] = selectedDepts.joinToString(", ")
                    profileData["insuranceNumber"] = etInsuranceNumber.text.toString()
                    profileData["height"] = etHeight.text.toString().toDoubleOrNull() ?: 0.0
                    profileData["weight"] = etWeight.text.toString().toDoubleOrNull() ?: 0.0
                    profileData["ailment"] = etCondition.text.toString()
                    profileData["servicePreference"] = etServiceTime.text.toString()
                } else {
                    profileData["desiredSalary"] = etSalary.text.toString().toDoubleOrNull() ?: 0.0
                    val availability = mutableMapOf<String, Boolean>()
                    for (i in 0 until cgAvailability.childCount) {
                        val chip = cgAvailability.getChildAt(i) as com.google.android.material.chip.Chip
                        availability[chip.text.toString().lowercase()] = chip.isChecked
                    }
                    profileData["availabilityDetails"] = com.google.gson.Gson().toJson(availability)
                    profileData["certifications"] = etCertifications.text.toString()
                }

                val request = RegisterRequest(
                    firstName = fName,
                    lastName = lName,
                    email = email,
                    password = password,
                    role = role,
                    phone = phone.ifEmpty { null },
                    profile = profileData
                )

                val response = ApiClient.apiService.register(request)

                withContext(Dispatchers.Main) {
                    btnRegister.visibility = View.VISIBLE
                    progressBar.visibility = View.GONE

                    if (response.isSuccessful && response.body() != null) {
                        val registerResponse = response.body()!!
                        ApiClient.setToken(registerResponse.token)

                        val sessionManager = SessionManager(this@RegisterActivity)
                        sessionManager.saveToken(registerResponse.token)
                        sessionManager.saveRole(registerResponse.user.role)

                        val intent = if (registerResponse.user.role == "CAREGIVER") {
                            Intent(this@RegisterActivity, CaregiverDashboardActivity::class.java)
                        } else {
                            Intent(this@RegisterActivity, PatientDashboardActivity::class.java)
                        }
                        startActivity(intent)
                        finish()
                    } else {
                        val errorMsg = response.errorBody()?.string()?.let {
                            try {
                                com.google.gson.JsonParser().parse(it).asJsonObject.get("message").asString
                            } catch (e: Exception) { "Registration failed" }
                        } ?: "Registration failed"
                        Toast.makeText(this@RegisterActivity, errorMsg, Toast.LENGTH_LONG).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    btnRegister.visibility = View.VISIBLE
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@RegisterActivity, "Connection error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
