

BACKEND_ADDRESS = {}
FIRST_BACKEND_DIRECT_ADDRESS = {}

for role_name, role in ROLES.items():
    role['name'] = role_name
    assign_default(role, 'is_cache_backend', True)
    assign_default(role, 'port', 80)
    assign_default(role, 'hosts', role_name)
    assign_default(role, 'backends', [])

    assign_default(role, 'subdomain', None)

    backends = role['backends']
    for ip in HOSTS[role['hosts']]:
        backends.append({'ip': ip})

    for host in backends:
        assign_default(host, 'port', role['port'])
        assign_default(host, 'name', role_name + '_' + host['ip'].replace('.', '_'))

    if len(role['backends']):
        FIRST_BACKEND_DIRECT_ADDRESS[role_name] = role['backends'][0]['ip'] + ':' + str(role['port'])
    else:
        FIRST_BACKEND_DIRECT_ADDRESS[role_name] = None
    if SURROUND_RUNNING_ON_PLATFORM and role['subdomain'] is not None:
        BACKEND_ADDRESS[role_name] = role['subdomain'] + '.' + TOP_DOMAIN
    else:
        BACKEND_ADDRESS[role_name] = FIRST_BACKEND_DIRECT_ADDRESS[role_name]

