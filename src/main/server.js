// SPDX-FileCopyrightText: 2023 Awayume <dev@awayume.jp>
// SPDX-License-Identifier: APGL-3.0-only

'use strict';

const dgram = require('node:dgram');
const net = require('node:net');

const { addIndent } = require('./utils/strings');

/**
 * @typedef {import('node:buffer').Buffer} Buffer
 * @typedef {dgram.Socket} UDPSocket
 * @typedef {net.Server} TCPServer
 * @typedef {net.Socket} TCPSocket
 */


exports.Server = class {
  /**
   * The DNS server.
   * @param {number} [port] - A port to listen.
   * @param {?boolean} [ipv6] - Whether to use IPv6.
   * @throws {TypeError}
   */
  constructor(port, ipv6) {
    // Argument check
    if (!port) {
      throw new TypeError('The argument \'port\' is not specified.');
    }

    // Initialize server
    /**
     * @type {number}
     * @readonly
     */
    this._port = port
    /**
     * @type {UPDSocket}
     * @readonly
     */
    this._udp_socket = dgram.createSocket(ipv6 ? 'udp6' : 'udp4');
    /**
     * @type {TCPServer}
     * @readonly
     */
    this._tcp_server = net.createServer(this._tcp_socket_handler.bind(this));

    // Freeze object
    Object.freeze(this);

    // Add event listeners
    this._udp_socket.on('error', this._on_udp_error.bind(this));
    this._udp_socket.on('listening', this._on_udp_listening.bind(this));
    this._udp_socket.on('message', this._on_udp_message.bind(this));
    this._tcp_server.on('error', this._on_tcp_error.bind(this));
    this._tcp_server.on('listening', this._on_tcp_listening.bind(this));
  };

  /**
   * An error handler for UDP socket.
   * @param {Error} [err] - An error object.
   */
  async _on_udp_error(err) {
    console.error('A UDP connection error occured:\n' + addIndent(err.stack, 2));
  };

  /**
   * An event handler for UDP port listening.
   */
  async _on_udp_listening() {
    const address = this._udp_socket.address();
    console.log(`UDP server listening on port ${address.port}.`);
  };

  /**
   * An event handler for UDP message.
   * @param {Buffer} [msg] - Payload of message.
   * @param {{address: string, family: string, port: number, size: number}} [rinfo] - Remote address information.
   */
  async _on_udp_message(msg, rinfo) {
    console.log(`A message received from UDP connection: \n${msg}\n${rinfo}`);
  };

  /**
   * An error handler for TCP server.
   * @param {Error} [err] - An error object.
   */
  async _on_tcp_error(err) {
    console.error('A TCP connection error occured:\n' + addIndent(err.stack, 2));
  };

  /**
   * An event handler for TCP port listening.
   */
  async _on_tcp_listening() {
    const address = this._tcp_server.address();
    console.log(`TCP server listening on port ${address.port}.`);
  };

  /**
   * An event handler for TCP data.
   * @param {Buffer|string} [data] - Payload of data.
   */
  async _tcp_data_handler(data) {
    console.log('A data received from TCP connection: \n' + data);
  };

  /**
   * An error handler for TCP socket.
   * @param {Error} [err] - An error object.
   */
  async _tcp_socket_error_handler(err) {
    console.error('A TCP socket error occured:\n' + addIndent(err.stack, 2));
  };

  /**
   * An event handler for TCP socket.
   * @param {TCPSocket} [socket] - TCP socket.
   */
  async _tcp_socket_handler(socket) {
    socket.on('data', this._tcp_data_handler.bind(this));
    socket.on('error', this._tcp_socket_error_handler.bind(this))
  };

  /**
   * Run the DNS server.
   */
  run() {
    this._udp_socket.bind(this._port);
    this._tcp_server.listen(this._port);
    console.info('The DNS server started successfully.');
  };

  /**
   * Close the DNS server.
   */
  close() {
    this._udp_socket.close();
    this._tcp_server.close();
    console.info('The DNS server stopped successfully.');
  }
};
