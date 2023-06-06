FROM golang:1.20.4
WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
EXPOSE 8090
RUN go build -o ./out/dist .
CMD ./out/dist