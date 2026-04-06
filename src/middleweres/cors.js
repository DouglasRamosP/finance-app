const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://dashboard-financeira-three.vercel.app',
]

const DEFAULT_VERCEL_PREVIEW_PROJECTS = ['dashboard-financeira-three']
const DEFAULT_ALLOWED_HEADERS = ['Content-Type', 'Authorization']
const DEFAULT_ALLOWED_METHODS = 'GET,POST,PATCH,DELETE,OPTIONS'

const parseList = (value) => {
    return (value ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const appendVaryHeader = (response, value) => {
    const currentValue = response.getHeader('Vary')

    if (!currentValue) {
        response.setHeader('Vary', value)
        return
    }

    const currentValues = String(currentValue)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

    if (!currentValues.includes(value)) {
        response.setHeader('Vary', [...currentValues, value].join(', '))
    }
}

const getAllowedHeaders = (requestedHeaders) => {
    const requestHeaders = parseList(requestedHeaders)

    return [...new Set([...DEFAULT_ALLOWED_HEADERS, ...requestHeaders])].join(
        ', ',
    )
}

export const getAllowedCorsOrigins = () => {
    return [
        ...new Set([
            ...DEFAULT_ALLOWED_ORIGINS,
            ...parseList(process.env.CORS_ALLOWED_ORIGINS),
        ]),
    ]
}

export const getAllowedVercelPreviewProjects = () => {
    if (process.env.CORS_ALLOW_VERCEL_PREVIEWS === 'false') {
        return []
    }

    const configuredProjects = parseList(
        process.env.CORS_VERCEL_PREVIEW_PROJECTS,
    )

    if (configuredProjects.length > 0) {
        return [...new Set(configuredProjects)]
    }

    return DEFAULT_VERCEL_PREVIEW_PROJECTS
}

export const isAllowedCorsOrigin = (origin) => {
    if (!origin) {
        return true
    }

    if (getAllowedCorsOrigins().includes(origin)) {
        return true
    }

    return getAllowedVercelPreviewProjects().some((projectName) => {
        const previewRegex = new RegExp(
            `^https://${escapeRegex(projectName)}-.*\\.vercel\\.app$`,
        )

        return previewRegex.test(origin)
    })
}

export const cors = (request, response, next) => {
    const origin = request.headers.origin

    response.setHeader('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS)
    response.setHeader(
        'Access-Control-Allow-Headers',
        getAllowedHeaders(request.headers['access-control-request-headers']),
    )
    response.setHeader('Access-Control-Max-Age', '86400')
    appendVaryHeader(response, 'Origin')
    appendVaryHeader(response, 'Access-Control-Request-Headers')

    if (!origin) {
        if (request.method === 'OPTIONS') {
            return response.sendStatus(204)
        }

        return next()
    }

    if (!isAllowedCorsOrigin(origin)) {
        return response.status(403).send({
            message: 'Not allowed by CORS',
        })
    }

    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Credentials', 'true')

    if (request.method === 'OPTIONS') {
        return response.sendStatus(204)
    }

    next()
}
