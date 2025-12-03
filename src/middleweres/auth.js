import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        // pegar o access token do header
        const accessToken = request.headers?.authorization?.split('Bearer ')[1]

        if (!accessToken) {
            return response.status(401).send({ error: 'Unauthorized' })
        }
        // verificar se o token é válido
        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )

        if (!decodedToken) {
            return response.status(401).send({ error: 'Unauthorized' })
        }

        request.userId = decodedToken.userId
        // se for válido, chamar o next()
        next()
    } catch (error) {
        console.error(error)
        return response.status(401).send({ error: 'Unauthorized' })
    }
}
