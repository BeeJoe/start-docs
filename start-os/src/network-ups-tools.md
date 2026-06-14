# Network UPS Tools (NUT)

Network UPS Tools (NUT) lets StartOS monitor an uninterruptible power supply (UPS) and shut down safely when the UPS reports a low battery. StartOS can talk directly to a connected UPS or monitor a UPS through another NUT server on the network.

## Opening Network UPS Tools

Open **Settings > Network UPS Tools** from the sidebar under **WiFi**.

## Modes

StartOS supports three NUT modes:

- **Disabled** - Turns off NUT monitoring.
- **Direct UPS** - Monitors a UPS connected directly to the StartOS machine.
- **Network UPS Client** - Monitors a UPS through another NUT server on the network.

Each mode is described below.

### Disabled

Disabled turns off NUT monitoring.

### Direct UPS

Use Direct UPS when the UPS is connected directly to the StartOS machine, usually by USB.

Common settings:

- **UPS Name** - Internal NUT name, for example `ups`.
- **Driver** - For many USB UPS units, use `usbhid-ups`.
- **Device or address** - For most USB UPS units, use `auto`.
- **Monitor username/password** - Local credentials StartOS uses to monitor the UPS.
- **Allow network clients** - Enable only if other machines should monitor this UPS through StartOS.
- **Network client username/password** - Credentials remote NUT clients will use.
- **Shutdown delay** - Seconds StartOS waits after the final shutdown signal before powering down.

### Network UPS Client

Use Network UPS Client when another machine is already connected to the UPS and running NUT as the server.

Common settings:

- **UPS Name** - Must match the UPS name on the remote NUT server.
- **NUT server host** - IP address or hostname of the NUT server.
- **NUT server port** - Usually `3493`.
- **Monitor username/password** - Credentials from the remote NUT server.
- **Shutdown delay** - Seconds StartOS waits after the final shutdown signal.

## Status

After saving a Direct UPS or Network UPS Client configuration, StartOS shows **UPS Status**. This displays all data returned by the UPS, such as `ups.status`, `battery.charge`, `battery.runtime`, `input.voltage`, and driver details.

Click **Refresh** to reload the status. If StartOS cannot read valid UPS data, it shows a system notification and an error message. Check the UPS name, host, port, credentials, driver, and cable or network connection.

## Operational Notes

For a network UPS setup, the router or switch between StartOS and the NUT server should also be on UPS power. Otherwise, StartOS may lose network access before it can receive the low-battery signal.

To test safely, confirm the status page reports normal data first. Then unplug the UPS from wall power, not the StartOS power cable, and verify `ups.status` changes from online to on-battery. Avoid draining the battery unless you are prepared for a real shutdown.
