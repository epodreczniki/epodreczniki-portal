

for name, conf in EPO_CONTENT_REPOSITORIES_DESCRIPTOR.items():
    nice_name = name + '_repository'
    role = { 'port': conf["backend"]["port"], 'subdomain': name + '.repo' }


    ROLES.update({ nice_name: role })

    HOSTS.update({nice_name: conf["backend"]["ip"]})


