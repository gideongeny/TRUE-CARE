package com.example.caregiver.api

import com.example.caregiver.models.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PATCH
import retrofit2.http.Path

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

    @GET("auth/me")
    suspend fun getMe(): Response<User>

    @GET("shifts")
    suspend fun getShifts(): Response<List<Shift>>

    @GET("requests")
    suspend fun getRequests(): Response<List<ServiceRequest>>

    @POST("requests")
    suspend fun createRequest(@Body request: ServiceRequest): Response<ServiceRequest>

    @POST("payments/stk-push")
    suspend fun initiateStkPush(@Body request: PaymentRequest): Response<PaymentResponse>

    @POST("shifts/{id}/accept")
    suspend fun acceptShift(@Path("id") id: String): Response<Shift>

    @POST("shifts/{id}/clock-in")
    suspend fun clockIn(@Path("id") id: String): Response<Shift>

    @POST("shifts/{id}/clock-out")
    suspend fun clockOut(@Path("id") id: String): Response<Shift>

    // Clinical Logging (v2.0)
    @POST("clinical")
    suspend fun addClinicalLog(@Body request: ClinicalLogRequest): Response<ClinicalLog>

    @GET("clinical/shift/{shiftId}")
    suspend fun getClinicalLogs(@Path("shiftId") shiftId: String): Response<List<ClinicalLog>>

    @GET("clinical/patient/{patientId}")
    suspend fun getPatientHealthHistory(@Path("patientId") patientId: String): Response<List<ClinicalLog>>

    // Finance & Wallet (v2.0)
    @GET("finance/wallet")
    suspend fun getWalletBalance(): Response<WalletResponse>

    @POST("finance/withdraw")
    suspend fun requestWithdrawal(@Body request: WithdrawalRequest): Response<WithdrawalResponse>

    // Notifications (v2.0)
    @GET("users/meta/notifications")
    suspend fun getNotifications(): Response<List<Notification>>

    @PATCH("users/meta/notifications/{id}/read")
    suspend fun markNotificationRead(@Path("id") id: String): Response<Unit>

    // Verification (v2.0)
    @GET("verification/status")
    suspend fun getVerificationStatus(): Response<VerificationStatusResponse>

    @POST("verification/upload")
    suspend fun uploadDoc(@Body request: VerificationDoc): Response<VerificationDoc>
}
