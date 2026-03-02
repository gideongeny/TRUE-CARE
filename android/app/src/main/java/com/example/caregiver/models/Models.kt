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
    val phone: String? = null,
    val profile: Map<String, Any>? = null
)

data class RegisterResponse(val token: String, val user: User)

data class User(
    val id: String,
    val email: String,
    val role: String,
    val firstName: String? = null,
    val lastName: String? = null,
    val profile: Profile?,
    val payments: List<Payment>? = emptyList()
)

data class Profile(
    val firstName: String,
    val lastName: String,
    val phone: String? = null,
    val balance: Double = 0.0,
    val ailment: String? = null,
    val location: String? = null,
    val address: String? = null
)

data class Shift(
    val id: String,
    val startTime: String,
    val endTime: String,
    val status: String,
    val shiftType: String = "Day",
    val earnings: Double? = 0.0,
    val notes: String?,
    val patient: User?,
    val caregiver: User?
)

data class ServiceRequest(
    val id: String = "",
    val patientId: String? = null,
    val careType: String,
    val duration: String,
    val location: String,
    val status: String = "PENDING",
    val description: String? = null,
    val price: Double? = null,
    val patientAilment: String? = null,
    val createdAt: String = ""
)

data class Payment(
    val id: String,
    val amount: Double,
    val status: String,
    val type: String,
    val transactionId: String?,
    val createdAt: String
)

data class PaymentRequest(
    val amount: Double,
    val phoneNumber: String,
    val userId: String
)

data class PaymentResponse(
    val message: String,
    val paymentId: String,
    val CheckoutRequestID: String? = null
)

// Clinical Logging (v2.0)
data class ClinicalLogRequest(
    val shiftId: String,
    val content: String,
    val vitals: Map<String, String>? = null
)

data class ClinicalLog(
    val id: String,
    val shiftId: String,
    val content: String,
    val vitals: String?,
    val loggedAt: String
)

// Finance & Wallet (v2.0)
data class WalletResponse(
    val balance: Double,
    val history: List<WithdrawalRequest>
)

data class WithdrawalRequest(
    val id: String? = null,
    val amount: Double,
    val mpesaNumber: String,
    val status: String? = null,
    val createdAt: String? = null
)

data class WithdrawalResponse(
    val message: String,
    val request: WithdrawalRequest? = null
)

// Notifications (v2.0)
data class Notification(
    val id: String,
    val title: String,
    val message: String,
    val isRead: Boolean,
    val type: String?,
    val createdAt: String
)

// Verification (v2.0)
data class VerificationDoc(
    val id: String,
    val title: String,
    val docUrl: String,
    val status: String,
    val createdAt: String
)

data class VerificationStatusResponse(
    val isVerified: Boolean,
    val documents: List<VerificationDoc>
)
