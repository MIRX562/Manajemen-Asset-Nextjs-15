// app/components/CheckoutOverview.tsx

import { getCheckoutMetrics } from "@/actions/checkinout-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Adjust as needed

const CheckoutOverview = async () => {
  const { checkedOutAssets, availableAssets, overdueCheckouts } =
    await getCheckoutMetrics();

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Checked Out Assets</CardTitle>
          <CardDescription>Assets currently checked out</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">{checkedOutAssets}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Assets</CardTitle>
          <CardDescription>Assets available for checkout</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">{availableAssets}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Checkouts</CardTitle>
          <CardDescription>Assets that are overdue for return</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">{overdueCheckouts}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutOverview;
