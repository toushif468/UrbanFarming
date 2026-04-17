import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Urban Farming Platform API',
            version: '1.0.0',
            description: 'Backend API for the Interactive Urban Farming Platform'
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication routes' },
            { name: 'Vendors', description: 'Vendor management' },
            { name: 'Produce', description: 'Marketplace produce' },
            { name: 'Orders', description: 'Order management' },
            { name: 'Forum', description: 'Community forum' },
            { name: 'Rentals', description: 'Farm space rentals' },
            { name: 'Certifications', description: 'Sustainability certifications' }
        ],
        paths: {
            // ─── AUTH ───────────────────────────────────────────
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'password'],
                                    properties: {
                                        name: { type: 'string', example: 'John Doe' },
                                        email: { type: 'string', example: 'john@test.com' },
                                        password: { type: 'string', example: '123456' },
                                        role: { type: 'string', enum: ['CUSTOMER', 'VENDOR'], example: 'CUSTOMER' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'User registered successfully' },
                        409: { description: 'Email already registered' }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login and get JWT token',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'john@test.com' },
                                        password: { type: 'string', example: '123456' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login successful, returns JWT token' },
                        401: { description: 'Invalid credentials' }
                    }
                }
            },

            // ─── VENDORS ────────────────────────────────────────
            '/api/vendors/profile': {
                post: {
                    tags: ['Vendors'],
                    summary: 'Create vendor profile (Vendor only)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        farmName: { type: 'string', example: 'Green Acres' },
                                        farmLocation: { type: 'string', example: 'Dhaka, Bangladesh' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Vendor profile created' },
                        409: { description: 'Profile already exists' }
                    }
                }
            },
            '/api/vendors/profile/me': {
                get: {
                    tags: ['Vendors'],
                    summary: 'Get my vendor profile (Vendor only)',
                    responses: {
                        200: { description: 'Vendor profile fetched' },
                        404: { description: 'Profile not found' }
                    }
                }
            },
            '/api/vendors/all': {
                get: {
                    tags: ['Vendors'],
                    summary: 'Get all vendors (Admin only)',
                    responses: { 200: { description: 'All vendors fetched' } }
                }
            },
            '/api/vendors/approve/{id}': {
                patch: {
                    tags: ['Vendors'],
                    summary: 'Approve a vendor (Admin only)',
                    parameters: [{
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: { 200: { description: 'Vendor approved' } }
                }
            },

            // ─── PRODUCE ────────────────────────────────────────
            '/api/produce': {
                get: {
                    tags: ['Produce'],
                    summary: 'Get all produce (Public)',
                    security: [],
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', example: 10 } },
                        { name: 'category', in: 'query', schema: { type: 'string', example: 'Vegetables' } }
                    ],
                    responses: { 200: { description: 'Produce list with pagination' } }
                },
                post: {
                    tags: ['Produce'],
                    summary: 'Create produce listing (Vendor only)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string', example: 'Fresh Tomatoes' },
                                        description: { type: 'string', example: 'Organic tomatoes' },
                                        price: { type: 'number', example: 2.50 },
                                        category: { type: 'string', example: 'Vegetables' },
                                        availableQuantity: { type: 'integer', example: 100 }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Produce created' } }
                }
            },
            '/api/produce/{id}': {
                get: {
                    tags: ['Produce'],
                    summary: 'Get produce by ID (Public)',
                    security: [],
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: {
                        200: { description: 'Produce fetched' },
                        404: { description: 'Not found' }
                    }
                },
                put: {
                    tags: ['Produce'],
                    summary: 'Update produce (Vendor only)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: { 200: { description: 'Produce updated' } }
                },
                delete: {
                    tags: ['Produce'],
                    summary: 'Delete produce (Vendor only)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: { 200: { description: 'Produce deleted' } }
                }
            },

            // ─── ORDERS ─────────────────────────────────────────
            '/api/orders': {
                post: {
                    tags: ['Orders'],
                    summary: 'Place an order (Customer only)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        produceId: { type: 'integer', example: 1 }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Order placed' } }
                }
            },
            '/api/orders/my': {
                get: {
                    tags: ['Orders'],
                    summary: 'Get my orders (Customer only)',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer' } },
                        { name: 'limit', in: 'query', schema: { type: 'integer' } }
                    ],
                    responses: { 200: { description: 'Customer orders' } }
                }
            },
            '/api/orders/vendor': {
                get: {
                    tags: ['Orders'],
                    summary: 'Get vendor orders (Vendor only)',
                    responses: { 200: { description: 'Vendor orders' } }
                }
            },
            '/api/orders/{id}/status': {
                patch: {
                    tags: ['Orders'],
                    summary: 'Update order status (Vendor only)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            enum: ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED']
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Status updated' } }
                }
            },

            // ─── FORUM ──────────────────────────────────────────
            '/api/forum': {
                get: {
                    tags: ['Forum'],
                    summary: 'Get all posts (Public)',
                    security: [],
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer' } },
                        { name: 'limit', in: 'query', schema: { type: 'integer' } }
                    ],
                    responses: { 200: { description: 'Forum posts' } }
                },
                post: {
                    tags: ['Forum'],
                    summary: 'Create a post (Any logged in user)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        postContent: { type: 'string', example: 'Tips for growing tomatoes!' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Post created' } }
                }
            },
            '/api/forum/{id}': {
                delete: {
                    tags: ['Forum'],
                    summary: 'Delete a post (Owner or Admin)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: { 200: { description: 'Post deleted' } }
                }
            },

            // ─── RENTALS ────────────────────────────────────────
            '/api/rentals': {
                get: {
                    tags: ['Rentals'],
                    summary: 'Get all rental spaces (Public)',
                    security: [],
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer' } },
                        { name: 'limit', in: 'query', schema: { type: 'integer' } },
                        { name: 'location', in: 'query', schema: { type: 'string', example: 'Dhaka' } }
                    ],
                    responses: { 200: { description: 'Rental spaces' } }
                },
                post: {
                    tags: ['Rentals'],
                    summary: 'Create rental space (Vendor only)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        location: { type: 'string', example: 'Mirpur, Dhaka' },
                                        size: { type: 'string', example: '10x10 meters' },
                                        price: { type: 'number', example: 500 }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Rental space created' } }
                }
            },
            '/api/rentals/{id}': {
                patch: {
                    tags: ['Rentals'],
                    summary: 'Update rental availability (Vendor only)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        availability: { type: 'boolean', example: false }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Availability updated' } }
                },
                delete: {
                    tags: ['Rentals'],
                    summary: 'Delete rental space (Vendor only)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: { 200: { description: 'Rental space deleted' } }
                }
            },

            // ─── CERTIFICATIONS ─────────────────────────────────
            '/api/certs': {
                post: {
                    tags: ['Certifications'],
                    summary: 'Submit certification (Vendor only)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        certifyingAgency: { type: 'string', example: 'Bangladesh Organic Board' },
                                        certificationDate: { type: 'string', example: '2025-01-15' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Certification submitted' } }
                }
            },
            '/api/certs/my': {
                get: {
                    tags: ['Certifications'],
                    summary: 'Get my certifications (Vendor only)',
                    responses: { 200: { description: 'My certifications' } }
                }
            },
            '/api/certs/all': {
                get: {
                    tags: ['Certifications'],
                    summary: 'Get all certifications (Admin only)',
                    responses: { 200: { description: 'All certifications' } }
                }
            },
            '/api/certs/{id}/approve': {
                patch: {
                    tags: ['Certifications'],
                    summary: 'Approve certification (Admin only)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: { 200: { description: 'Certification approved' } }
                }
            },
            '/api/certs/{id}/reject': {
                patch: {
                    tags: ['Certifications'],
                    summary: 'Reject certification (Admin only)',
                    parameters: [{
                        name: 'id', in: 'path', required: true,
                        schema: { type: 'integer' }
                    }],
                    responses: { 200: { description: 'Certification rejected' } }
                }
            }
        }
    },
    apis: []
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    console.log('📄 Swagger docs available at: http://localhost:4000/api/docs')
}