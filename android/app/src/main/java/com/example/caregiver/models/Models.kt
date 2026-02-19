package com.example.caregiver.models

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val role: String,
    val phone: String? = null
)

data class RegisterResponse(val token: String, val user: User)

data class User(
    val id: String,
    val email: String,
    val role: String,
    val profile: Profile?
)

data class Profile(
    val firstName: String,
    val lastName: String,
    val address: String?
)

data class Shift(
    val id: String,
    val startTime: String,
    val endTime: String,
    val status: String,
    val notes: String?,
    val patient: User?,
    val caregiver: User?
)

data class ServiceRequest(
    val id: String,
    val patientId: String?,
    val careType: String,
    val duration: String,
    val location: String,
    val status: String,
    val description: String?,
    val createdAt: String
)
