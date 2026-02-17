package com.example.caregiver.api

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
<<<<<<< HEAD
    private val BASE_URL = Config.BASE_URL
=======
    private const val BASE_URL = "http://10.0.2.2:4000/api/" // Updated to port 4000 for True Care API
>>>>>>> 19273b9096fa76d374989ee9afb141420f514580
    
    private var token: String? = null

    fun setToken(newToken: String) {
        token = newToken
    }

    private val httpClient = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val original = chain.request()
            val requestBuilder = original.newBuilder()
            
            token?.let {
                requestBuilder.header("Authorization", "Bearer $it")
            }
            
            chain.proceed(requestBuilder.build())
        }
        .build()

    val apiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
