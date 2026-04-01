package com.example.caregiver.utils

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("TRUE_CARE_PREFS", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_TOKEN = "jwt_token"
        private const val KEY_ROLE = "user_role"
        private const val KEY_BIOMETRIC_ENABLED = "biometric_enabled"
        private const val KEY_EMAIL = "user_email"
        private const val KEY_PASSWORD = "user_password"
        private const val KEY_PREMIUM = "is_premium"
    }

    fun savePremiumStatus(isPremium: Boolean) {
        prefs.edit().putBoolean(KEY_PREMIUM, isPremium).apply()
    }

    fun isPremium(): Boolean = prefs.getBoolean(KEY_PREMIUM, false)

    fun saveToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
    }

    fun getToken(): String? = prefs.getString(KEY_TOKEN, null)

    fun saveRole(role: String) {
        prefs.edit().putString(KEY_ROLE, role).apply()
    }

    fun getRole(): String? = prefs.getString(KEY_ROLE, null)

    fun saveUserCredentials(email: String, pass: String) {
        prefs.edit().putString(KEY_EMAIL, email).putString(KEY_PASSWORD, pass).apply()
    }

    fun getEmail(): String? = prefs.getString(KEY_EMAIL, null)
    fun getPassword(): String? = prefs.getString(KEY_PASSWORD, null)

    fun setBiometricEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_BIOMETRIC_ENABLED, enabled).apply()
    }

    fun isBiometricEnabled(): Boolean = prefs.getBoolean(KEY_BIOMETRIC_ENABLED, false)

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
