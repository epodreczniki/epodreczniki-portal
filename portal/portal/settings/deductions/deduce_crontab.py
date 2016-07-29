from celery.schedules import crontab

CELERYBEAT_SCHEDULE = {
    'refresh-statistics': {
        'task': 'front.tasks.regenerate_statistics',
        'schedule': crontab(hour=EPO_REFRESH_STATS_HOUR),
    },
    'publications-report': {
        'task': 'common.tasks.send_publication_report',
        'schedule': crontab(hour=15, minute=30),
    },
    'reschedule-publications': {
        'task': 'publication.tasks.recheck_all_objects_waiting_on_dependencies',
        'schedule': crontab(minute=(0, 15, 30, 45)),
    },
    'clear-publications': {
        'task': 'publication.tasks.remove_old_successed_publications',
        'schedule': crontab(hour=3, minute=0),
    },
    'report-publications': {
        'task': 'publication.tasks.send_periodic_publication_report',
        'schedule': crontab(hour=16, minute=0),
    },
    'cronjob-health-check': {
        'task': 'common.tasks.health_check',
        'schedule': crontab(minute=0), # each full hour
    },
    'reindex-collections-solr': {
        'task': 'search.tasks.index_all_collections',
        'schedule': crontab(minute=0, hour=0), # each midnight
    },
    'reindex-kzd': {
        'task': 'editsearch.tasks.edit_index_kzd',
        'schedule': crontab(minute=0, hour=2),
    },
    'feed-graphite': {
        'task': 'front.tasks.feed_collectd_from_piwik',
        'schedule': 60,
    },
}

CELERY_TIMEZONE = 'Europe/Warsaw'
