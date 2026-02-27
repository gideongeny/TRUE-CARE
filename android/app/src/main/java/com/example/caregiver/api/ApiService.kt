package com.example.caregiver.api

import com.example.caregiver.models.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

    @GET("shifts")
    suspend fun getShifts(): Response<List<Shift>>

    @GET("requests")
    suspend fun getRequests(): Response<List<ServiceRequest>>

    @POST("requests")
    suspend fun createRequest(@Body request: ServiceRequest): Response<ServiceRequest>

    @POST("payments/stk-push")
    suspend fun initiateStkPush(@Body request: PaymentRequest): Response<PaymentResponse>
}
