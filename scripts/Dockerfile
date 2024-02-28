# Use the latest Ubuntu image as the base for the Archifiltre project container
FROM ubuntu:latest

# Copy the application folder into the container at /test
# This directory will contain the Archifiltre project's application files
COPY ./test-folder /test

# Copy the filesystem loading script into the container at /test
# This script is used for setting up or configuring the filesystem for Archifiltre
COPY ./load-filesystem.sh /test

# Create a non-root user 'archifiltreuser' for running the Archifiltre application
# This improves security by running the application with limited privileges
RUN groupadd -r archifiltreuser && useradd -r -g archifiltreuser archifiltreuser

# Change ownership of the copied files to the 'archifiltreuser'
# Ensures that the Archifiltre application and its scripts can be executed by this user
RUN chown -R archifiltreuser:archifiltreuser /test

# Switch to the non-root user 'archifiltreuser' for enhanced security
USER archifiltreuser

# Define the entrypoint script and its default argument for the Archifiltre container
# This script is executed at container startup to prepare the Archifiltre application's environment
ENTRYPOINT ["/test/load-filesystem.sh", "/test/child"]
