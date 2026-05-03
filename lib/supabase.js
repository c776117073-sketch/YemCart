"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
exports.createServerSupabaseClient = createServerSupabaseClient;
var ssr_1 = require("@supabase/ssr");
var headers_1 = require("next/headers");
// Supabase configuration
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Client-side Supabase client
function createClient() {
    return (0, ssr_1.createBrowserClient)(supabaseUrl, supabaseAnonKey);
}
// Server-side Supabase client
function createServerSupabaseClient() {
    var cookieStore = (0, headers_1.cookies)();
    return (0, ssr_1.createServerClient)(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get: function (name) {
                var _a;
                return (_a = cookieStore.get(name)) === null || _a === void 0 ? void 0 : _a.value;
            },
            set: function (name, value, options) {
                try {
                    cookieStore.set(__assign({ name: name, value: value }, options));
                }
                catch (error) {
                    // The `set` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
            remove: function (name, options) {
                try {
                    cookieStore.set(__assign({ name: name, value: '' }, options));
                }
                catch (error) {
                    // The `delete` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
        },
    });
}
