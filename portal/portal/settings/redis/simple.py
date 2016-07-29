REDIS_CACHES = {
    "redis": {
        "BACKEND": "redis_cache.cache.RedisCache",
        "LOCATION": "192.168.1.50:6379:1",
        "OPTIONS": {
            "CLIENT_CLASS": "redis_cache.client.DefaultClient",
        }
    }
}
