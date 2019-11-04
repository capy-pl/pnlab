db = db.getSiblingDB('pn');

db.createUser({
    user: 'test',
    pwd: 'test',
    roles: [{
        role: 'readWrite',
        db: 'pn'
    }, ]
});