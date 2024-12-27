/**
 * Unqork Express Internal Services
 * @owner Unqork Unofficial
 * @author Kashif Raza
 * @apiversion 
 */
/**
 * Module Related Services
 * 
 */
const EXPRESS_SERVICES = [
    {
        service: "executeModule",
        endpoint: "/fbu/uapi/modules/${moduleId}/execute",
        method: "put"
    }
]

module.exports = {
    EXPRESS_SERVICES
}