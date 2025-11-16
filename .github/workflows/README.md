# GitHub Actions Workflows

This directory contains CI/CD workflows for testing and building microservices.

## Workflows

### 1. `test-services.yml` - Full Service Test

**Purpose:** Comprehensive testing of all services including build, startup, and health checks.

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop`
- Manual trigger via `workflow_dispatch`

**What it does:**
1. ✅ Creates environment files for all services
2. 🔨 Builds all Docker images
3. 🚀 Starts all services with docker-compose
4. 🏥 Performs health checks on each service
5. 📋 Collects logs if any service fails
6. 📝 Generates detailed error reports
7. 📤 Uploads logs as artifacts
8. 💬 Comments on PRs with health report

**Outputs:**
- `service-report.md` - Health status of all services
- `error-report.md` - Detailed error information (if any)
- Service logs in `logs/` directory
- Build and startup logs

**Artifacts:**
- All logs are uploaded as artifacts (retained for 7 days)
- Accessible from the Actions tab in GitHub

### 2. `build-check.yml` - Quick Build Check

**Purpose:** Fast parallel build verification for each service individually.

**Triggers:**
- Push to `main` or `master` branches
- Pull requests to `main` or `master`

**What it does:**
1. 🔨 Builds each service in parallel (matrix strategy)
2. ✅ Verifies each service builds successfully
3. 📤 Uploads build logs if build fails

**Benefits:**
- Faster feedback (parallel builds)
- Identifies which specific service has build issues
- Less resource intensive

## Service Health Checks

The `test-services.yml` workflow checks the following services:

### Infrastructure Services
- ✅ **PostgreSQL** (Port 5432)
- ✅ **Redis** (Port 6379)
- ✅ **MongoDB** (Port 27017)
- ✅ **Zookeeper** (Port 2181)
- ✅ **Kafka** (Port 9092)

### Microservices
- ✅ **Auth Service** (Port 3001) - `/api/register`
- ✅ **User Service** (Port 3002) - `/health`
- ✅ **Order Service** (Port 3003) - `/health`
- ✅ **Payment Service** (Port 3004) - `/health`
- ✅ **Notification Service** (Port 3005) - `/health`
- ✅ **API Gateway** (Port 8080) - `/health`

## Reports

### Service Report Format

```markdown
# Service Health Report

**Build Date:** [timestamp]

## Service Status
✅ PostgreSQL is healthy
✅ Redis is healthy
...

## Microservices
✅ Auth Service is healthy
✅ User Service is healthy
...

## Overall Status
✅ SUCCESS
```

### Error Report Format

```markdown
# Error Report

**Build Date:** [timestamp]

## Failed Services

### [service-name]
**Error Count:** X

**Last 20 error lines:**
```
[error logs]
```

## Service Status
[ docker-compose ps output ]
```

## Viewing Results

### In GitHub UI

1. Go to **Actions** tab in your repository
2. Click on the workflow run
3. View logs for each step
4. Download artifacts (logs, reports) from the summary page

### In Pull Requests

If a PR triggers the workflow, a comment will be automatically added with:
- Service health status
- Error report (if any failures)
- Links to full logs

## Manual Trigger

You can manually trigger the full test workflow:

1. Go to **Actions** tab
2. Select **Test Microservices Build and Health**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Troubleshooting

### Build Failures

If a service fails to build:
1. Check the build logs in artifacts
2. Look for Dockerfile errors
3. Verify dependencies in `package.json`
4. Check environment variables

### Health Check Failures

If a service fails health check:
1. Check service logs in `logs/` directory
2. Verify service is listening on correct port
3. Check for database/Redis/Kafka connection issues
4. Review error report for specific errors

### Timeout Issues

If workflow times out:
- Increase timeout in workflow file
- Check if services are taking too long to start
- Verify Kafka/Zookeeper are ready before services start

## Customization

### Adding New Services

To add a new service to health checks:

1. Add service to health check step in `test-services.yml`:
```yaml
check_service "New Service" 3006 /health || true
```

2. Add service logs collection:
```yaml
docker-compose logs new-service > logs/new-service.log 2>&1 || true
```

### Changing Timeouts

Modify the sleep duration in `test-services.yml`:
```yaml
sleep 30  # Increase if services need more time
```

### Adding More Checks

Add custom checks in the health check step:
```yaml
- name: Custom Check
  run: |
    # Your custom check logic
```

## Best Practices

1. ✅ Always check workflow status before merging PRs
2. ✅ Review error reports for any failures
3. ✅ Keep build logs for debugging
4. ✅ Update health check endpoints if service changes
5. ✅ Test locally before pushing changes

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or download from https://github.com/nektos/act/releases

# Run workflow
act -W .github/workflows/test-services.yml
```

## Support

For issues with workflows:
1. Check workflow logs in GitHub Actions
2. Review error reports
3. Verify docker-compose.yml configuration
4. Test services locally with `docker-compose up`
