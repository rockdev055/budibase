const { Client } = require("@elastic/elasticsearch")
const { QUERY_TYPES, FIELD_TYPES } = require("./Integration")

const SCHEMA = {
  datasource: {
    url: {
      type: "string",
      required: true,
      default: "http://localhost:9200",
    },
  },
  query: {
    create: {
      "ES Query DSL": {
        type: QUERY_TYPES.FIELDS,
        customisable: true,
        fields: {
          index: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
        },
      },
    },
    read: {
      "ES Query DSL": {
        type: QUERY_TYPES.FIELDS,
        customisable: true,
        fields: {
          index: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
        },
      },
    },
    update: {
      "ES Query DSL": {
        type: QUERY_TYPES.FIELDS,
        customisable: true,
        fields: {
          id: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
          index: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
        },
      },
    },
    delete: {
      "Document ID": {
        type: QUERY_TYPES.FIELDS,
        fields: {
          index: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
          id: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
        },
      },
    },
  },
}

class ElasticSearchIntegration {
  constructor(config) {
    this.config = config
    this.client = new Client({ node: config.url })
  }

  async create(query) {
    const { index, json } = query

    try {
      const result = await this.client.index({
        index,
        body: json,
      })
      return result.body
    } catch (err) {
      console.error("Error writing to elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async read(query) {
    const { index, json } = query
    try {
      const result = await this.client.search({
        index: index,
        body: json,
      })
      return result.body.hits.hits.map(({ _source }) => _source)
    } catch (err) {
      console.error("Error querying elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async update(query) {
    const { id, index, json } = query
    try {
      const result = await this.client.update({
        id,
        index,
        body: json,
      })
      return result.body
    } catch (err) {
      console.error("Error querying elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async delete(query) {
    try {
      const result = await this.client.delete(query)
      return result.body
    } catch (err) {
      console.error("Error deleting from elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }
}

module.exports = {
  schema: SCHEMA,
  integration: ElasticSearchIntegration,
}
